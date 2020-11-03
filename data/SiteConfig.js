const config = {
  siteTitle: "MANN.FR : Services in Computers and Organizations", // Site title.
  siteTitleShort: "MANN.FR", // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: "MANN.FR : Services in Computers and Organizations", // Alternative site title for SEO.
  siteLogo: "/logos/logo-1024.png", // Logo used for SEO and manifest.
  siteUrl: "https://alpha.mann.fr", // Domain of your website without pathPrefix.
  pathPrefix: "/", // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteDescription: "Chris Mann and company consider digital well-being in this century.", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  siteRssTitle: "MANN.FR RSS feed", // Title of the RSS feed
  siteFBAppID: "", // FB Application ID for using app insights
  googleAnalyticsID: "", // GA tracking ID.
  disqusShortname: "", // Disqus shortname.
  dateFromFormat: "YYYY-MM-DD", // Date format used in the frontmatter.
  dateFormat: "YYYY-MM-DD", // Date format for display.
  postsPerPage: 4, // Amount of posts displayed per listing page.
  userName: "Chris Mann", // Username to display in the author segment.
  userEmail: "chris@mann.fr", // Email used for RSS feed's author segment
  userTwitter: "chris2fr", // Optionally renders "Follow Me" in the UserInfo segment.
  userLocation: "Greater Paris, France", // User location to display in the author segment.
  userAvatar: "https://www.mann.fr/chris/images/chris_mann_small_drawing.png", // User avatar to display in the author segment.
  userDescription:
    "Chris Mann, a general-purpose cyber consultant with heart.", // User description to display in the author segment.
  // Links to social profiles/projects you want to display in the author segment/navigation bar.
  userLinks: [
    {
      label: "GitHub",
      url: "https://github.com/chris2fr",
      iconClassName: "fa fa-github"
    },
    {
      label: "Twitter",
      url: "https://twitter.com/chris2fr",
      iconClassName: "fa fa-twitter"
    },
    {
      label: "Email",
      url: "mailto:chris@mann.fr",
      iconClassName: "fa fa-envelope"
    }
  ],
  copyright: "Copyright © 2020. Chris Mann", // Copyright string for the footer of the website and RSS feed.
  themeColor: "#c62828", // Used for setting manifest and progress theme colors.
  backgroundColor: "#e0e0e0" // Used for setting manifest background color.
};

// Validate

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === "/") {
  config.pathPrefix = "";
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, "")}`;
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === "/")
  config.siteUrl = config.siteUrl.slice(0, -1);

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== "/")
  config.siteRss = `/${config.siteRss}`;

module.exports = config;
