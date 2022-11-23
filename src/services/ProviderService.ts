import HttpService from './HttpService';

class ProviderService extends HttpService {
  constructor() {
    super({});
  }

  private static classInstance?: ProviderService;

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new ProviderService();
    }
    return this.classInstance;
  }

  public async getSubmodelList() {
    const res = await this.instance({
      method: 'GET',
      url: '/submodels',
    });
    return res.data;
  }

  public async getSubmodelDetails(submodel: string) {
    const res = await this.instance({
      method: 'GET',
      url: `/submodels/${submodel}`,
    });
    return res.data;
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

  public async uploadData(url: string, data: FormData) {
    const res = await this.instance({
      method: 'POST',
      url: `${url}/upload`,
      data,
    });
    return res;
  }

  public async submitSubmodalData(url: string, data: unknown) {
    const res = await this.instance({
      method: 'POST',
      url: `${url}/manualentry`,
      data,
    });
    return res;
  }

  public async deleteSubmodal(processId: string, csvType: string) {
    const res = await this.instance({
      method: 'DELETE',
      url: `${csvType}/delete/${processId}`,
    });
    return res;
  }
}

export default ProviderService;
