import { Router } from "express";
import { FinancingDAO } from "../dao/FinancingDAO";
import { ErrorControl } from "../constants/ErrorControl";

export class FinancingController extends FinancingDAO {
  private router: Router;

  constructor() {
    super();
    this.router = Router();
  }

  public routes(): Router {
    this.router.get("/user/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const data = await FinancingDAO.getFinancingByUserId(id);
      if (data[0] === ErrorControl.SUCCESS) {
        return res
          .status(data[2])
          .send("Financing found successfully: " + data[1]);
      }
      return res.status(data[2]).send(data[1]);
    });

    this.router.get("/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const data = await FinancingDAO.getFinancingById(id);
      if (data[0] === ErrorControl.SUCCESS) {
        return res
          .status(data[2])
          .send("Financing found successfully: " + data[1]);
      }
      return res.status(data[2]).send(data[1]);
    });

    this.router.post("/", async (req, res) => {
      const data = await FinancingDAO.add(req.body);
      if (data[0] === ErrorControl.SUCCESS) {
        return res
          .status(data[2])
          .send("Financing created successfully: " + data[1]);
      }
      return res.status(data[2]).send(data[1]);
    });

    this.router.put("/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const data = await FinancingDAO.update(req.body, id);
      if (data[0] === ErrorControl.SUCCESS) {
        return res
          .status(data[2])
          .send("Financing updated successfully: " + data[1]);
      }
      return res.status(data[2]).send(data[1]);
    });

    this.router.delete("/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const data = await FinancingDAO.delete(id);
      if (data[0] === ErrorControl.SUCCESS) {
        return res
          .status(data[2])
          .send("Financing deleted successfully: " + data[1]);
      }
      return res.status(data[2]).send(data[1]);
    });

    return this.router;
  }
}