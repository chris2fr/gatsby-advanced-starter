import React from "react";
import { Helmet } from "react-helmet";
import config from "../../data/SiteConfig";
import { graphql, Link } from "gatsby";
// import "../../src/cssl/"
// import "./index.css";

export default class MainLayout extends React.Component {
  render() {
    const {children, slug, sitePage} = this.props;
    const sitePageContext = sitePage.context;
    const breadcrumbs = sitePageContext.breadcrumbs;
    const subpages = sitePageContext.subpages;
    const topMenu = [{slug: "/services/",title:"Services"},{slug: "/solutions/",title:"Solutions"},{slug: "/company/",title:"Company"},{slug: "/company/contact/",title:"Hire"}];

    return (
      <div className="layout-container">
        <Helmet>
          <meta name="description" content={config.siteDescription} />
          <html lang="en" />
        </Helmet>

        <div className="container"><div className="row"><div className="three columns">
          {/*}
        <Link to="/" key="home">
                    <h2 key="home">MANN.FR</h2>
        </Link>
        <ul>
        {topMenu.map( topMenuItem => (
          
          <li key={topMenuItem.slug}><Link to={topMenuItem.slug} key={topMenuItem.slug}>{topMenuItem.title}</Link> 
          {(breadcrumbs) && (breadcrumbs.length > 2) && (breadcrumbs[1].slug == topMenuItem.slug) &&
                <ul>
                 <li><Link to={breadcrumbs[2].slug}>{breadcrumbs[2].title}</Link>
                 {(breadcrumbs.length > 3) && 
                  <ul><li><Link to={breadcrumbs[3].slug}>{breadcrumbs[3].title}</Link></li></ul>
                }</li>
             </ul>
            }
          </li>

        ))}
        </ul>
        {*/}
        <ol>
                      {/* Breadcrumbs */
               breadcrumbs &&
               breadcrumbs.map(breadcrumb => (
                <li>
                  <Link to={breadcrumb.slug} key={breadcrumb.title}>
                    {breadcrumb.title || "Home" }
                  </Link>
                  </li>
                ))
            }
            </ol>
        {sitePageContext.title}
        <ul>
              {sitePageContext.subpages && 
                sitePageContext.subpages.map(subMenuItem => (
                  <li><Link to={subMenuItem.slug}>{subMenuItem.title}</Link></li>
                ))
              }
      </ul>
            </div>
            <div className="nine columns">
        {children}
        </div></div></div>
      </div>
    );
  }
}
