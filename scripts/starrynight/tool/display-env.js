parseVariable = function (processEnv) {
  if (processEnv === undefined) {
    return "not specified";
  } else {
    return processEnv;
  }
};


module.exports = function (options) {
  console.log("Displaying environment variables:");
  console.log("PORT:                                  " + parseVariable(process.env.PORT));
  console.log("MONGO_URL:                             " + parseVariable(process.env.MONGO_URL));
  console.log("ROOT_URL:                              " + parseVariable(process.env.ROOT_URL));
  console.log("OPLOG_URL:                             " + parseVariable(process.env.OPLOG_URL));
  console.log("MONGO_OPLOG_URL:                       " + parseVariable(process.env.MONGO_OPLOG_URL));
  console.log("METEOR_ENV:                            " + parseVariable(process.env.METEOR_ENV));
  console.log("NODE_ENV:                              " + parseVariable(process.env.NODE_ENV));
  console.log("NODE_OPTIONS:                          " + parseVariable(process.env.NODE_OPTIONS));
  console.log("DISABLE_WEBSOCKETS:                    " + parseVariable(process.env.DISABLE_WEBSOCKETS));
  console.log("MAIL_URL:                              " + parseVariable(process.env.MAIL_URL));
  console.log("DDP_DEFAULT_CONNECTION_URL:            " + parseVariable(process.env.DDP_DEFAULT_CONNECTION_URL));
  console.log("HTTP_PROXY:                            " + parseVariable(process.env.HTTP_PROXY));
  console.log("HTTPS_PROXY:                           " + parseVariable(process.env.HTTPS_PROXY));
  console.log("METEOR_OFFLINE_CATALOG:                " + parseVariable(process.env.METEOR_OFFLINE_CATALOG));
  console.log("METEOR_PROFILE:                        " + parseVariable(process.env.METEOR_PROFILE));
  console.log("METEOR_DEBUG_BUILD:                    " + parseVariable(process.env.METEOR_DEBUG_BUILD));
  console.log("TINYTEST_FILTER:                       " + parseVariable(process.env.TINYTEST_FILTER));
  console.log("MOBILE_ROOT_URL:                       " + parseVariable(process.env.MOBILE_ROOT_URL));
  console.log("NODE_DEBUG:                            " + parseVariable(process.env.NODE_DEBUG));
  console.log("BIND_IP:                               " + parseVariable(process.env.BIND_IP));
  console.log("PACKAGE_DIRS:                          " + parseVariable(process.env.PACKAGE_DIRS));
  console.log("DEBUG:                                 " + parseVariable(process.env.DEBUG));
  console.log("");

  if (options.all) {
    console.log("METEOR_PRINT_CONSTRAINT_SOLVER_INPUT:  " + parseVariable(process.env.METEOR_PRINT_CONSTRAINT_SOLVER_INPUT));
    console.log("METEOR_CATALOG_COMPRESS_RPCS:          " + parseVariable(process.env.METEOR_CATALOG_COMPRESS_RPCS));
    console.log("METEOR_MINIFY_LEGACY:                  " + parseVariable(process.env.METEOR_MINIFY_LEGACY));
    console.log("METEOR_DEBUG_SQL:                      " + parseVariable(process.env.METEOR_DEBUG_SQL));
    console.log("METEOR_WAREHOUSE_DIR:                  " + parseVariable(process.env.METEOR_WAREHOUSE_DIR));
    console.log("AUTOUPDATE_VERSION:                    " + parseVariable(process.env.AUTOUPDATE_VERSION));
    console.log("USE_GLOBAL_ADK:                        " + parseVariable(process.env.USE_GLOBAL_ADK));
    console.log("METEOR_AVD:                            " + parseVariable(process.env.METEOR_AVD));
    console.log("DEFAULT_AVD_NAME:                      " + parseVariable(process.env.DEFAULT_AVD_NAME));
    console.log("METEOR_BUILD_FARM_URL:                 " + parseVariable(process.env.METEOR_BUILD_FARM_URL));
    console.log("METEOR_PACKAGE_SERVER_URL:             " + parseVariable(process.env.METEOR_PACKAGE_SERVER_URL));
    console.log("METEOR_PACKAGE_STATS_SERVER_URL:       " + parseVariable(process.env.METEOR_PACKAGE_STATS_SERVER_URL));
    console.log("DEPLOY_HOSTNAME:                       " + parseVariable(process.env.DEPLOY_HOSTNAME));
    console.log("METEOR_SESSION_FILE:                   " + parseVariable(process.env.METEOR_SESSION_FILE));
    console.log("METEOR_PROGRESS_DEBUG:                 " + parseVariable(process.env.METEOR_PROGRESS_DEBUG));
    console.log("METEOR_PRETTY_OUTPUT:                  " + parseVariable(process.env.METEOR_PRETTY_OUTPUT));
    console.log("APP_ID:                                " + parseVariable(process.env.APP_ID));
    console.log("AUTOUPDATE_VERSION:                    " + parseVariable(process.env.AUTOUPDATE_VERSION));
    console.log("CONSTRAINT_SOLVER_BENCHMARK:           " + parseVariable(process.env.CONSTRAINT_SOLVER_BENCHMARK));
    console.log("DDP_DEFAULT_CONNECTION_URL:            " + parseVariable(process.env.DDP_DEFAULT_CONNECTION_URL));
    console.log("SERVER_WEBSOCKET_COMPRESSION:          " + parseVariable(process.env.SERVER_WEBSOCKET_COMPRESSION));
    console.log("USE_JSESSIONID:                        " + parseVariable(process.env.USE_JSESSIONID));
    console.log("METEOR_PKG_SPIDERABLE_PHANTOMJS_ARGS:  " + parseVariable(process.env.METEOR_PKG_SPIDERABLE_PHANTOMJS_ARGS));
    console.log("WRITE_RUNNER_JS:                       " + parseVariable(process.env.WRITE_RUNNER_JS));
    console.log("TINYTEST_FILTER:                       " + parseVariable(process.env.TINYTEST_FILTER));
    console.log("METEOR_PARENT_PID:                     " + parseVariable(process.env.METEOR_PARENT_PID));
    console.log("METEOR_TOOL_PATH:                      " + parseVariable(process.env.METEOR_TOOL_PATH));
    console.log("RUN_ONCE_OUTCOME:                      " + parseVariable(process.env.RUN_ONCE_OUTCOME));
    console.log("TREE_HASH_DEBUG:                       " + parseVariable(process.env.TREE_HASH_DEBUG));
    console.log("METEOR_DEBUG_SPRINGBOARD:              " + parseVariable(process.env.METEOR_DEBUG_SPRINGBOARD));
    console.log("METEOR_TEST_FAIL_RELEASE_DOWNLOAD:     " + parseVariable(process.env.METEOR_TEST_FAIL_RELEASE_DOWNLOAD));
    console.log("METEOR_CATALOG_COMPRESS_RPCS:          " + parseVariable(process.env.METEOR_CATALOG_COMPRESS_RPCS));
    console.log("METEOR_TEST_LATEST_RELEASE:            " + parseVariable(process.env.METEOR_TEST_LATEST_RELEASE));
    console.log("METEOR_WATCH_POLLING_INTERVAL_MS:      " + parseVariable(process.env.METEOR_WATCH_POLLING_INTERVAL_MS));
    console.log("EMACS:                                 " + parseVariable(process.env.EMACS));
    console.log("METEOR_PACKAGE_STATS_TEST_OUTPUT:      " + parseVariable(process.env.METEOR_PACKAGE_STATS_TEST_OUTPUT));
    console.log("METEOR_TEST_TMP:                       " + parseVariable(process.env.METEOR_TEST_TMP));
  }
};
