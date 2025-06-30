export class OrdersService {
  getAll() {
    return [
      { id: 1, name: "order 1" },
      { id: 2, name: "order 2" },
    ];
  }

  create({}: any) {
    // creating in DB
    return { id: 1, name: "order 1" };
  }

  delete({}: any) {
    // deleting
    return { id: 1, name: "order 1" };
  }

  getOne() {
    return { id: 1, name: "order 1" };
  }
}
