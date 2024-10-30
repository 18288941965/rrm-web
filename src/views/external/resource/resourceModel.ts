import {PaginationQr} from '@utils/interface'

interface ResourceBeanBase{
    serviceName: string
    className: string
    resourceName: string
}

interface ResourceQueryBean extends  ResourceBeanBase{
    packageName: string
    methodName: string
    requestPath: string
    requestMethod: string
    resourceType: string
    authCode: string
    environment: string
    status: number | null
}

interface ResourceBean extends ResourceQueryBean{
    id: string
}

interface ResourceBeanVO extends ResourceBean{
    resourceTypeName: string | null
    authCodeName: string | null
    environmentName: string | null
}

interface ResourceQuery extends ResourceQueryBean, PaginationQr{

}

interface PackageNameTree {
    name: string
    children?: PackageNameTree[]
}

interface ResourceScanBean{
    url: string
    token: string
    microservice: string
    axiosType: string
    apiKey: string
}

export {
    type ResourceBeanBase,
    type ResourceBean,
    type ResourceQuery,
    type ResourceBeanVO,
    type PackageNameTree,
    type ResourceScanBean,
}