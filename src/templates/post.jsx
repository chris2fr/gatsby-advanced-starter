import React from "react";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../layout";
import UserInfo from "../components/UserInfo/UserInfo";
import Disqus from "../components/Disqus/Disqus";
import PostTags from "../components/PostTags/PostTags";
import SocialLinks from "../components/SocialLinks/SocialLinks";
import SEO from "../components/SEO/SEO";
import Footer from "../components/Footer/Footer";
import config from "../../data/SiteConfig";
import "./b16-tomorrow-dark.css";
import "./post.css";
import { gt } from "lodash";

export default class PostTemplate extends React.Component {
  render() {
    const { data, pageContext } = this.props;
    const { slug } = pageContext;
    const postNode = data.markdownRemark;
    const sitePage = data.sitePage;
    const post = postNode.frontmatter;
    if (!post.id) {
      post.id = slug;
    }

    return (
      <Layout>
        <div>
          <Helmet>
            <title>{`${post.title} | ${config.siteTitle}`}</title>
          </Helmet>
          <SEO postPath={slug} postNode={postNode} postSEO />
          <div>
            <h1>{post.title}</h1>
            <div>
            <p>
            {/* Breadcrumbs */
               sitePage.context.breadcrumbs &&
               sitePage.context.breadcrumbs.map(breadcrumb => (
                  <Link to={breadcrumb.slug} key={breadcrumb.title}>
                  </Link>
                ))
            }
            </p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
            <div>
              <hr/>
              <h2>{post.title} > </h2>
              <ul>
               {/* Subpages */
               sitePage.context.subpages &&
               sitePage.context.subpages.map(subpage => (
                  <Link to={subpage.slug} key={subpage.title}>
                    <li key={subpage.slug}>{subpage.title}</li>
                  </Link>
                ))
            }
            </ul>
            <hr/>
            </div>
            <div className="post-meta">
              <PostTags tags={post.tags} />
              <SocialLinks postPath={slug} postNode={postNode} />
            </div>
            <UserInfo config={config} />
            <Disqus postNode={postNode} />
            <Footer config={config} />
          </div>
        </div>
      </Layout>
    );
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        cover
        date
        category
        tags
      }
      fields {
        slug
        date
      }
    }
    sitePage(context: {slug: {eq: $slug}}) {
      context {
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
