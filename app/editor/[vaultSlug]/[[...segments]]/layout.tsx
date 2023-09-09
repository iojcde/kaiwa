 

const Layout = async ({ editor, intro, params }) => {
  if (params.segments) {
    return <>{editor}</>
  } else {
    return <>{intro}</>
  }
}

export default Layout
