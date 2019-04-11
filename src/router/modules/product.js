import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/productCategory/tree',
  name: 'Product Manage',
  meta: {
    title: 'ProductManage',
    icon: 'tree-table'
  },
  children: [
    {
      path: 'product-category/tree',
      component: () => import('@/views/product/product-category/Tree'),
      name: 'ProductCategoryManage',
      meta: { title: 'ProductCategoryManage' }
    },
    {
      path: 'brand-category/list',
      component: () => import('@/views/product/brand-category/List'),
      name: 'BrandCategoryManage',
      meta: { title: 'BrandCategoryManage' }
    },
    {
      path: 'product-brand/list',
      component: () => import('@/views/product/product-brand/List'),
      name: 'ProductBrandManage',
      meta: { title: 'ProductBrandManage' }
    },
    {
      path: 'product-attribute-categry/list',
      component: () => import('@/views/product/product-attribute-category/List'),
      name: 'ProductAttributeCategoryManage',
      meta: { title: 'ProductAttributeCategoryManage' }
    },
    {
      path: 'product-attribute/list',
      component: () => import('@/views/product/product-attribute/List'),
      name: 'ProductAttribueManage',
      meta: { title: 'ProductAttribueManage' }
    }
  ]
}

export default productRouter
