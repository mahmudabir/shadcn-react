import { ExternalToast, toast } from "sonner";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"

export function toastSuccess(message: string, header: string = 'Success') {
    toast.success(header, {
        description: message,
        icon: <CheckCircle className="text-green-500"/>,
        classNames: {
            title: 'text-green-500',
            content: 'text-green-500',
        },
        ...defaultOptions,
    })
}

export function toastInfo(message: string, header: string = 'Info') {
    toast.info(header, {
        description: message,
        icon: <Info className="text-blue-500"/>,
        classNames: {
            title: 'text-blue-500',
            content: 'text-blue-500'
        },
        ...defaultOptions,
    })
}

export function toastWarning(message: string, header: string = 'Warning') {
    toast.warning(header, {
        description: message,
        icon: <AlertTriangle className="text-yellow-500"/>,
        classNames: {
            title: 'text-yellow-500',
            content: 'text-yellow-500'
        },
        ...defaultOptions,
    })
}

export function toastError(message: string, header: string = 'Error') {
    toast.error(header, {
        description: message,
        icon: <XCircle className="text-red-500"/>,
        classNames: {
            title: 'text-destructive',
            content: 'text-destructive',
        },
        ...defaultOptions,
    })
}

const defaultOptions: ExternalToast = {
    position: "top-center",
    duration: 5000,
    closeButton: true,
    dismissible: true,
    richColors: true
}

