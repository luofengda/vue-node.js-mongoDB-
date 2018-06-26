<template>
  <div id="app">
    <Layout>
        <Header>Header</Header>
          <Breadcrumb>
        <BreadcrumbItem to="/">Home</BreadcrumbItem>
        <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem>
        <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
    </Breadcrumb>
        <Content><router-view/></Content>
        <Footer>Footer</Footer>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
