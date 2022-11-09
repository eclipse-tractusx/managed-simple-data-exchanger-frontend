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
}

export default ProviderService;
