const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all",
        },
    };

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require("cssnano"),
                cssProcessorPluginOptions: {
                    preset: [
                        "default",
                        { discardComments: { removeAll: true } },
                    ],
                },
                canPrint: true,
            }),
            new TerserWebpackPlugin(),
        ];
    }

    return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoader = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: "../",
                hmr: isDev,
                reloadAll: true,
            },
        },
        "css-loader",
    ];

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ["@babel/polyfill", "./index.js"],
        analyticd: "./analytics.js",
    },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".js", ".json"],
        alias: {
            "@models": path.resolve(__dirname, "src/models"),
            "@": path.resolve(__dirname, "src"),
        },
    },
    optimization: optimization(),
    devtool: isDev ? "source-map" : "",
    devServer: {
        port: 4200,
        hot: isDev,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets/favicon.ico"),
                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: `css/${filename("css")}`,
            chunkFilename: "css/[id].css",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoader(),
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoader({
                    loader: "sass-loader",
                    options: {
                        // Prefer `dart-sass`
                        implementation: require("sass"),
                    },
                }),
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: ["file-loader"],
            },
            {
                test: /\.(ttf|eot|otf|woff|woff2)$/,
                use: ["file-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    },
                },
            },
        ],
    },
};
