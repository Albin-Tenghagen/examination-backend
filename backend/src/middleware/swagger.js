import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import path from "path";

const swaggerDocs = YAML.load(path.resolve("src/swagger/swagger.yaml"));
export { swaggerDocs, swaggerUi };
