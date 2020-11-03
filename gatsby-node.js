/* eslint "no-console": "off" */

const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const siteConfig = require("./data/SiteConfig");
// const breadcrumbs = require("./data/breadcrumbs");
const slugTitleMap = new Map();
const slugChildrenSlugsMap = new Map();
const slugBreadcrumbSlugsMap = new Map();
const slugBreadcrumbsMap = new Map();

// const slugParentsSlugsSet = new Set();

/*
exports.onPreBootstrap = ( ) => {
  const node = {
    //id: createNodeId("breadcrumps"),
    //...restOfNodeData
    subpages: new Map()
  }
  console.log(node);
};
*/

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type AuthorJson implements Node {
      joinedAt: Date
    }
  `
  createTypes(typeDefs)
};



// let breadcrumbs = new Map();

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  let slug = "/";
  let title = "";
  let breadcrumb = "";

  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    slug += (parsedFilePath.dir)?parsedFilePath.dir + "/":"";
    slug += parsedFilePath.name + "/";
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    ) {
      title = node.frontmatter.title;
    } else if ( Object.prototype.hasOwnProperty.call(node, "headings") &&
                node.headings.length > 0) {
      title = node.headings[0].value;
    } else {
      title = parsedFilePath.name.toUpperCase();
    } 

    if (Object.prototype.hasOwnProperty.call(node, "frontmatter")) {
      // if (Object.prototype.hasOwnProperty.call(node.frontmatter, "slug"))
      //  slug = `/${_.kebabCase(node.frontmatter.slug)}`;
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "date")) {
        const date = moment(node.frontmatter.date, siteConfig.dateFromFormat);
        if (!date.isValid)
          console.warn(`WARNING: Invalid date.`, node.frontmatter);
        createNodeField({ node, name: "date", value: date.toISOString() });
      }
    }

    // Set up breadcrumbs
    slugTitleMap.set(slug,title);
    createNodeField({ node, name: "title", value: title });
    createNodeField({ node, name: "slug", value: slug });
    breadcrumb = slug.substring(0,slug.lastIndexOf("/", slug.length - 2)+1)
    createNodeField({ node, name: "breadcrumb", value: breadcrumb });
    slugChildrenSlugsMap.set(slug, []);
    slugBreadcrumbSlugsMap.set(slug, breadcrumb);
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const postPage = path.resolve("src/templates/post.jsx");
  const tagPage = path.resolve("src/templates/tag.jsx");
  const categoryPage = path.resolve("src/templates/category.jsx");
  const listingPage = path.resolve("./src/templates/listing.jsx");
  const landingPage = path.resolve("./src/templates/landing.jsx");

  // Get a full list of markdown posts
  const markdownQueryResult = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            fields {
              slug
              breadcrumb
              title
            }
            frontmatter {
              title
              tags
              category
              date
            }
          }
        }
      }
    }
  `);

  if (markdownQueryResult.errors) {
    console.error(markdownQueryResult.errors);
    throw markdownQueryResult.errors;
  }

  const tagSet = new Set();
  const categorySet = new Set();

  const postsEdges = markdownQueryResult.data.allMarkdownRemark.edges;

  // Breadcrumbs
  postsEdges.forEach((edge, index) => {
    const node = postsEdges[index].node;
   
    let breadcrumbSlug = node.fields.slug;

    while (breadcrumbSlug.length > 1 && slugBreadcrumbSlugsMap.has(breadcrumbSlug) && slugBreadcrumbSlugsMap.get(breadcrumbSlug) != breadcrumbSlug ) {
      breadcrumbSlug = slugBreadcrumbSlugsMap.get(breadcrumbSlug);
      let breadcrumbs = (slugBreadcrumbsMap.has(node.fields.slug))?slugBreadcrumbsMap.get(node.fields.slug):[];
      breadcrumbs.unshift({slug: breadcrumbSlug, title: slugTitleMap.has(breadcrumbSlug)?slugTitleMap.get(breadcrumbSlug):breadcrumbSlug.slice(breadcrumbSlug.lastIndexOf("/",breadcrumbSlug.length -2)+1,breadcrumbSlug.length -1)});
      slugBreadcrumbsMap.set(node.fields.slug,breadcrumbs);
    } 
  });

  // Subpages
  postsEdges.forEach((edge, index) => {
    const node = postsEdges[index].node;
    let children = (slugChildrenSlugsMap.has(node.fields.breadcrumb))?slugChildrenSlugsMap.get(node.fields.breadcrumb):[];
    children.push({id: node.id, title: node.fields.title, slug: node.fields.slug});
    slugChildrenSlugsMap.set(node.fields.breadcrumb,children);
  });

  // Sort posts
  postsEdges.sort((postA, postB) => {
    const dateA = moment(
      postA.node.frontmatter.date,
      siteConfig.dateFromFormat
    );

    const dateB = moment(
      postB.node.frontmatter.date,
      siteConfig.dateFromFormat
    );

    if (dateA.isBefore(dateB)) return 1;
    if (dateB.isBefore(dateA)) return -1;

    return 0;
  });

  // Paging
  const { postsPerPage } = siteConfig;
  if (postsPerPage) {
    const pageCount = Math.ceil(postsEdges.length / postsPerPage);

    [...Array(pageCount)].forEach((_val, pageNum) => {
      createPage({
        path: pageNum === 0 ? `/` : `/${pageNum + 1}/`,
        component: listingPage,
        context: {
          limit: postsPerPage,
          skip: pageNum * postsPerPage,
          pageCount,
          currentPageNum: pageNum + 1
        }
      });
    });
  } else {
    // Load the landing page instead
    createPage({
      path: `/`,
      component: landingPage,
      context: {
        slug: "/",
        subpages: slugChildrenSlugsMap.get("/"),
        title: "Home"
      }
    });
  }

  // Post page creating
  postsEdges.forEach((edge, index) => {

    // Generate a list of tags
    if (edge.node.frontmatter.tags) {
      edge.node.frontmatter.tags.forEach(tag => {
        tagSet.add(tag);
      });
    }

    // Generate a list of categories
    if (edge.node.frontmatter.category) {
      categorySet.add(edge.node.frontmatter.category);
    }

    // Generate a map of sub pages



    // Create post pages
    const nextID = index + 1 < postsEdges.length ? index + 1 : 0;
    const prevID = index - 1 >= 0 ? index - 1 : postsEdges.length - 1;
    const nextEdge = postsEdges[nextID];
    const prevEdge = postsEdges[prevID];
    // let subpages = slugChildrenSlugsMap.get(edge.node.fields.slug);
    // console.log([edge.node.fields.slug,slugBreadcrumbsMap.get(edge.node.fields.slug)]);

    createPage({
      path: edge.node.fields.slug,
      component: postPage,
      context: {
        slug: edge.node.fields.slug,
        nexttitle: nextEdge.node.frontmatter.title,
        nextslug: nextEdge.node.fields.slug,
        prevtitle: prevEdge.node.frontmatter.title,
        prevslug: prevEdge.node.fields.slug,
        subpages: slugChildrenSlugsMap.get(edge.node.fields.slug),
        breadcrumbs: slugBreadcrumbsMap.get(edge.node.fields.slug),
        breadcrumbSlug: edge.node.fields.breadcrumb,
        title: edge.node.fields.title
      }
    });
  });

  //  Create tag pages
  tagSet.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagPage,
      context: { tag }
    });
  });

  // Create category pages
  categorySet.forEach(category => {
    createPage({
      path: `/categories/${_.kebabCase(category)}/`,
      component: categoryPage,
      context: { category }
    });
  });
};
