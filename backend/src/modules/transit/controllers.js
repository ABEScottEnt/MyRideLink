import {
  findRoutesService
} from "./services.js";

export const findRoutesController = async (req, res) => {
    console.log("controller called");
    await findRoutesService();
}