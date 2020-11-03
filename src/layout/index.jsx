import React from "react";
import { Helmet } from "react-helmet";
import config from "../../data/SiteConfig";
import { graphql, Link } from "gatsby";
// import "../../src/cssl/"
// import "./index.css";

export default class MainLayout extends React.Component {
  render() {
    const {children} = this.props;

    return (
      <div className="layout-container">
        <Helmet>
          <meta name="description" content={config.siteDescription} />
          <html lang="en" />
        </Helmet>

        <div className="container"><div className="row"><div className="three columns">
        <Link to="/" key="home">
                    <h2 key="home">MANN.FR</h2>
        </Link>
        <ul>
                  <Link to="/services/" key="home">
                    <li key="home">Services</li>
                  </Link>
                  <Link to="/solutions/" key="home">
                    <li key="home">Solutions</li>
                  </Link>
                  <Link to="/company/" key="home">
                    <li key="home">Company</li>
                  </Link>
                  <Link to="/company/contact/" key="Hire">
                    <li key="home">Hire</li>
                  </Link>
            </ul>
            </div>
            <div className="nine columns">
        {children}
        </div></div></div>
      </div>
    );
  }
}

/*
export const layoutQuery = graphql`
  query layoutQuery {
    allSitePage(filter: {context: {breadcrumbSlug: {eq: "/"}}}) {
      edges {
        node {
          context {
            slug
            title
          }
        }
      }
    }
  }
`
*/