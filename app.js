require("console-stamp")(console, "[HH:MM:ss.l]");
// require('./consoleTimestamp')();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./configuration");
const expressValidator = require("express-validator");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const plantRouter = require("./routes/plant");
const generateRouter = require("./routes/generate");
const herbsmedRouter = require("./routes/herbsmed");
const companyRouter = require("./routes/company");
const compoundRouter = require("./routes/compound");
const medtypeRouter = require("./routes/medtype");
const dclassRouter = require("./routes/dclass");
const refformulaRouter = require("./routes/refformula");
const crudedrugRouter = require("./routes/crudedrug");
const explicitRouter = require("./routes/explicit");
const tacitRouter = require("./routes/tacit");
const plantetnichRouter = require("./routes/plantethnic");
const provinceRouter = require("./routes/province");
const ethnicRouter = require("./routes/ethnic");
const databaseRouter = require("./routes/database");
const adminRouter = require("./routes/admin");

const app = express();
const cors = require("cors");
app.use(expressValidator());
app.use(cors());
app.use("/public/images/herbsmed", express.static("public/images/herbsmed"));
app.use("/public/files/explicit", express.static("public/files/explicit"));
app.use(
  "/public/files/data/import",
  express.static("public/files/data/import")
);
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(logger('dev'));
// app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/jamu/api/", indexRouter);
app.use("/jamu/api/user", userRouter);
app.use("/jamu/api/plant", plantRouter);
app.use("/jamu/api/generate", generateRouter);
app.use("/jamu/api/herbsmed", herbsmedRouter);
app.use("/jamu/api/company", companyRouter);
app.use("/jamu/api/compound", compoundRouter);
app.use("/jamu/api/medtype", medtypeRouter);
app.use("/jamu/api/dclass", dclassRouter);
app.use("/jamu/api/refformula", refformulaRouter);
app.use("/jamu/api/crudedrug", crudedrugRouter);
app.use("/jamu/api/tacit", tacitRouter);
app.use("/jamu/api/explicit", explicitRouter);
app.use("/jamu/api/plantethnic", plantetnichRouter);
app.use("/jamu/api/province", provinceRouter);
app.use("/jamu/api/ethnic", ethnicRouter);
app.use("/jamu/api/db", databaseRouter);
app.use("/jamu/api/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
