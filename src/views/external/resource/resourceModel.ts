import {PaginationQr} from '@utils/interface'

interface ResourceBeanBase{
    serviceName: string
    className: string
    resourceName: string
}

interface ResourceBean extends ResourceBeanBase{
    id: string
    packageName: string
    methodName: string
    requestPath: string
    requestMethod: string
    resourceType: string
    authCode: number
    environment: string
    status: number
}

interface ResourceBeanVO extends ResourceBean{
    resourceTypeName: string | null
    authCodeName: string | null
    environmentName: string | null
}

interface ResourceQuery extends ResourceBeanBase, PaginationQr{
}

export {
    type ResourceBeanBase,
    type ResourceBean,
    type ResourceQuery,
    type ResourceBeanVO,
}