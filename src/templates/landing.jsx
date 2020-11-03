import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing/PostListing";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";

class Landing extends React.Component {
  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;
    const sitePage = this.props.data.sitePage;
    const slug = sitePage.context.slug;
    return (
      <Layout  slug={slug} sitePage={sitePage}>
          <div className="header">
            <Helmet title={config.siteTitle} />
            <SEO />
            <h1 className="title">MANN.FR</h1>
            <h2 className="subtitle">Well-Being in this Digital Era</h2>
        </div>
      </Layout>
    );
  }
}

export default Landing;

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query LandingQuery {
    allMarkdownRemark(sort: { fields: [fields___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
            date
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
    }sitePage(context: {slug: {eq: "/"}}) {
      context {
        title
        slug
        subpages {
          slug
          title
        }
        breadcrumbs {
          slug
          title
        }
        breadcrumbSlug
      }
    }
  }
`;
