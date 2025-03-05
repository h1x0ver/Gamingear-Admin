import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const conceptsNavigationConfig: NavigationTree[] = [
    {
        key: 'concepts',
        path: '',
        title: 'Concepts',
        translateKey: 'nav.concepts',
        icon: 'concepts',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 4,
            },
        },
        subMenu: [

            {
                key: 'concepts.products',
                path: '',
                title: 'Products',
                translateKey: 'nav.conceptsProducts.products',
                icon: 'products',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsProducts.productsDesc',
                        label: 'Product inventory management',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.products.productList',
                        path: `${CONCEPTS_PREFIX_PATH}/products/product-list`,
                        title: 'Product List',
                        translateKey: 'nav.conceptsProducts.productList',
                        icon: 'productList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProducts.productListDesc',
                                label: 'All products listed',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.products.productEdit',
                        path: `${CONCEPTS_PREFIX_PATH}/products/product-edit/12`,
                        title: 'Product Edit',
                        translateKey: 'nav.conceptsProducts.productEdit',
                        icon: 'productEdit',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProducts.productEditDesc',
                                label: 'Edit product details',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.products.productCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/products/product-create`,
                        title: 'Product Create',
                        translateKey: 'nav.conceptsProducts.productCreate',
                        icon: 'productCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProducts.productCreateDesc',
                                label: 'Add new product',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },

            {
                key: 'concepts.categories',
                path: '',
                title: 'categories',
                translateKey: 'nav.conceptsategories.categories',
                icon: 'products',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsCategory.categoryDescription',
                        label: 'category inventory managment',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.categories.categoryList',
                        path: `${CONCEPTS_PREFIX_PATH}/categories/category-list`,
                        title: 'List',
                        translateKey: 'nav.conceptsCategory.categoryList',
                        icon: 'categoryList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.categories.categoryCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/categories/category-create`,
                        title: 'Category Create',
                        translateKey: 'nav.conceptsCategories.categoryCreate',
                        icon: 'Category Create',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },

            {
                key: 'concepts.Brand',
                path: '',
                title: 'Brand',
                translateKey: 'nav.conceptsBrand.Brand',
                icon: 'products',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsBrand.brandDescription',
                        label: 'Brand inventory managment',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.brand.brandList',
                        path: `${CONCEPTS_PREFIX_PATH}/brand/brand-list`,
                        title: 'List',
                        translateKey: 'nav.conceptsBrand.brandList',
                        icon: 'brandList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                    {
                        key: 'concepts.brand.brandCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/brand/brand-create`,
                        title: 'Brand Create',
                        translateKey: 'nav.conceptsBrand.brandCreate',
                        icon: 'Category Create',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        subMenu: [],
                    },
                ],
            },



        ],
    },
]

export default conceptsNavigationConfig
