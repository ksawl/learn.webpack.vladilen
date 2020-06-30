import "./styles/styles.css";
import "./styles/scss.scss";
import "./styles/bootstrap/bootstrap.scss"
import "./babel";

import * as $ from "jquery";

import Logo from "./assets/logo.png";
import Post from "@models/Post";

const post = new Post("Webpack Post Title", Logo);

console.log("Post to String: ", post.toString());

$("pre").addClass("code").html(post.toString());
