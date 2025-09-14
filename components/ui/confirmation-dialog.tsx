"use client"

import { AlertTriangle, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "warning" | "success"
  icon?: "delete" | "add" | "remove" | "warning"
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  icon = "warning",
  isLoading = false
}: ConfirmationDialogProps) {
  const getIcon = () => {
    switch (icon) {
      case "delete":
        return <Trash2 className="h-6 w-6 text-red-600" />
      case "add":
        return <Plus className="h-6 w-6 text-green-600" />
      case "remove":
        return <Minus className="h-6 w-6 text-orange-600" />
      case "warning":
      default:
        return <AlertTriangle className="h-6 w-6 text-orange-600" />
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          iconColor: "text-red-600"
        }
      case "warning":
        return {
          confirmButton: "bg-orange-600 hover:bg-orange-700 text-white",
          iconColor: "text-orange-600"
        }
      case "success":
        return {
          confirmButton: "bg-green-600 hover:bg-green-700 text-white",
          iconColor: "text-green-600"
        }
      default:
        return {
          confirmButton: "bg-primary hover:bg-primary/90 text-white",
          iconColor: "text-primary"
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={styles.iconColor}>
              {getIcon()}
            </div>
            <DialogTitle className="text-left">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={styles.confirmButton}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
