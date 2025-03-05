import { useEffect, useState, useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Progress from '@/components/ui/Progress'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useProductList from '../hooks/useProductList'
import classNames from '@/utils/classNames'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { FiPackage } from 'react-icons/fi'
import { NumericFormat } from 'react-number-format'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Product } from '../types'
import type { TableQueries } from '@/@types/common'

const ProductColumn = ({ row }: { row: Product }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={60}
                {...(row.images[0] ? { src: row.images[0] } : { icon: <FiPackage /> })}
            />
            <div>
                <div className="font-bold heading-text mb-1">{row.name}</div>
            </div>
        </div>
    )
}

const ActionColumn = ({
                          onEdit,
                          onDelete,
                      }: {
    onEdit: () => void
    onDelete: () => void
}) => {
    return (
        <div className="flex items-center justify-end gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="Delete">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onDelete}
                >
                    <TbTrash />
                </div>
            </Tooltip>
        </div>
    )
}

const ProductListTable = () => {
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')
    const [productList, setProductList] = useState<Product[]>([])
    const [productListTotal, setProductListTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [tableData, setTableData] = useState<TableQueries>({
        pageIndex: 0,
        pageSize: 10,
    })

    const fetchProducts = async (pageIndex: number, pageSize: number) => {
        setIsLoading(true)
        try {
            const response = await fetch(`https://gamingear.premiumasp.net/api/Products?pageIndex=${pageIndex}&pageSize=${pageSize}`)
            const data = await response.json()
            setProductList(data.items)
            setProductListTotal(data.count)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts(tableData.pageIndex, tableData.pageSize)
    }, [tableData.pageIndex, tableData.pageSize])

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: 'Product',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const { price } = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            <NumericFormat
                                fixedDecimalScale
                                prefix="$"
                                displayType="text"
                                value={price}
                                decimalScale={2}
                                thousandSeparator={true}
                            />
                        </span>
                    )
                },
            },
            {
                header: 'Quantity',
                accessorKey: 'stock',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {row.stockQuantity}
                        </span>
                    )
                },
            },
            {
                header: 'Sales',
                accessorKey: 'status',
                cell: (props) => {
                    const { salesPercentage, sales } = props.row.original
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="flex gap-1">
                                <span className="font-semibold">
                                    <NumericFormat
                                        displayType="text"
                                        value={sales}
                                        thousandSeparator={true}
                                    />
                                </span>
                                <span>Sales</span>
                            </span>
                            <Progress
                                percent={salesPercentage}
                                showInfo={false}
                                customColorClass={classNames(
                                    'bg-error',
                                    salesPercentage > 40 && 'bg-warning',
                                    salesPercentage > 70 && 'bg-success',
                                )}
                            />
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],
        [],
    )

    const handleEdit = (product: Product) => {
        navigate(`/concepts/products/product-edit/${product.id}`)
    }

    const handleDelete = (product: Product) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(product.id)
    }

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`https://gamingear.premiumasp.net/api/Products/${toDeleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            })
            if (response.ok) {
                // Удаление успешно, обновляем список продуктов
                const newProductList = productList.filter((product) => product.id !== toDeleteId)
                setProductList(newProductList)
                setDeleteConfirmationOpen(false)
                setToDeleteId('')
            } else {
                console.error('Failed to delete product')
            }
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        setTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = value
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        setTableData(newTableData)
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={productList}
                noData={!isLoading && productList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: productListTotal,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove product"
                onClose={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this product? This action can't be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProductListTable
