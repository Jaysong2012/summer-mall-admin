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
      path: 'productCategory/tree',
      component: () => import('@/views/product/product-category/Tree'),
      name: 'ProductCategoryManage',
      meta: { title: 'ProductCategoryManage' }
    },
    {
      path: 'productBrand/list',
      component: () => import('@/views/product/product-category/Tree'),
      name: 'ProductBrandManage',
      meta: { title: 'ProductBrandManage' }
    }
  ]
}

export default productRouter
