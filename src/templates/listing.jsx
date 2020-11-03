import React from "react";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing/PostListing";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";
import "./listing.css";

class Listing extends React.Component {
  renderPaging() {
    const { currentPageNum, pageCount } = this.props.pageContext;
    const prevPage = currentPageNum - 1 === 1 ? "/" : `/${currentPageNum - 1}/`;
    const nextPage = `/${currentPageNum + 1}/`;
    const isFirstPage = currentPageNum === 1;
    const isLastPage = currentPageNum === pageCount;


    return (
      <div className="paging-container">
        {!isFirstPage && <Link to={prevPage}>Previous</Link>}
        {[...Array(pageCount)].map((_val, index) => {
          const pageNum = index + 1;
          return (
            <Link
              key={`listing-page-${pageNum}`}
              to={pageNum === 1 ? "/" : `/${pageNum}/`}
            >
              {pageNum}
            </Link>
          );
        })}
        {!isLastPage && <Link to={nextPage}>Next</Link>}
      </div>
    );
  }

  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;
    const sitePages = this.props.data.allSitePage;

    return (
      <Layout>
        <div className="listing-container">
          <div className="posts-container">
            <Helmet title={config.siteTitle} />
            <SEO />
            <PostListing postEdges={postEdges}/>
          </div>
          <hr/>
              <h2>Menu </h2>
              <ul>
               {/* Subpages */
                  sitePages.edges.map(subpage => (
                  <Link to={subpage.node.context.slug} key={subpage.node.context.title}>
                    <li key={subpage.node.context.slug} >{subpage.node.context.title}</li>
                  </Link>
                ))
            }
            </ul>
            <hr/>
          {this.renderPaging()}
        </div>
      </Layout>
    );
  }
}

export default Listing;

/* eslint no-undef: "off" */
export const listingQuery = graphql`
  query ListingQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [fields___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
            date
            breadcrumb
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            cover
            date
          }
        }
      }
    }
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
`;
