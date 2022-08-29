import HttpService from './HttpService';

class DftService extends HttpService {
  public constructor() {
    super({});
  }

  private static classInstance?: DftService;

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new DftService();
    }
    return this.classInstance;
  }

  public async getReportById(id: string) {
    const res = await this.instance({
      method: 'GET',
      url: `/processing-report/${id}`,
    });
    return res;
  }

  public async getUploadHistory(params: unknown) {
    const res = await this.instance({
      method: 'GET',
      url: '/processing-report',
      params,
    });
    return res;
  }

  public async uploadData(data: FormData) {
    const res = await this.instance({
      method: 'POST',
      url: '/upload',
      data,
    });
    return res;
  }

  public async submitSubmodalData(url: string, data: unknown) {
    const res = await this.instance({
      method: 'POST',
      url,
      data,
    });
    return res;
  }
}

export default DftService;
