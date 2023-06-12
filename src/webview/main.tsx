import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import ZH from "antd/es/locale/zh_CN";
import "antd/dist/reset.css";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useAlgorithm } from "./state";
dayjs.locale("zh-cn");

const Main = () => {
  const { algorithm } = useAlgorithm();

  return (
    <ConfigProvider locale={ZH} theme={{ algorithm: [algorithm] }}>
      <StyleProvider
        hashPriority="high"
        transformers={[legacyLogicalPropertiesTransformer]}
      >
        <App />
      </StyleProvider>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />
);
