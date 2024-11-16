const mainLayout =       () => import('@/components/mainPage/app.vue')
const systemMainLayout = () => import('@/components/convert/main.vue')

const route =   {
  path: '/',
  component: mainLayout,
  children: [
    {
      path: '/convert',
      component: systemMainLayout,
    }
  ]
}

export default route