import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { ExternalToast, toast } from "sonner";

const defaultOptions: ExternalToast = {
    position: "bottom-right",
    duration: 5000,
    closeButton: true,
    dismissible: true,
    richColors: true
}

type titleT = (() => React.ReactNode) | React.ReactNode;

export function toastSuccess(message: titleT, header: titleT = 'Success') {
    toast.success(header, {
        description: message,
        icon: <CheckCircle className="text-green-500" />,
        classNames: {
            title: 'text-green-500',
            content: 'text-green-500',
        },
        ...defaultOptions,
    })
}

export function toastInfo(message: titleT, header: titleT = 'Info') {
    toast.info(header, {
        description: message,
        icon: <Info className="text-blue-500" />,
        classNames: {
            title: 'text-blue-500',
            content: 'text-blue-500'
        },
        ...defaultOptions,
    })
}

export function toastWarning(message: titleT, header: titleT = 'Warning') {
    toast.warning(header, {
        description: message,
        icon: <AlertTriangle className="text-yellow-500" />,
        classNames: {
            title: 'text-yellow-500',
            content: 'text-yellow-500'
        },
        ...defaultOptions,
    })
}

export function toastError(message: titleT, header: titleT = 'Error') {
    toast.error(header, {
        description: message,
        icon: <XCircle className="text-red-500" />,
        classNames: {
            title: 'text-destructive',
            content: 'text-destructive',
        },
        ...defaultOptions,
    })
}

