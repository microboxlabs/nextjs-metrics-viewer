export class MockNextResponse {
  constructor(
    private __data: any,
    private __status: number,
  ) {}

  static json(data: any, { status }: { status: number }) {
    return new MockNextResponse(data, status);
  }

  async json() {
    return this.__data;
  }

  get status() {
    return this.__status;
  }
}
