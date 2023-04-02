import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider, App as AntdApp } from "antd";
import ZH from "antd/es/locale/zh_CN";
import "antd/dist/reset.css";
import "./index.less";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider locale={ZH}>
    <AntdApp>
      <App />
    </AntdApp>
  </ConfigProvider>
);
