import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Document } from "../../../types";
import {
  createEditFormData,
  formatDisplayDate,
  fromDateToString,
  toDateObject,
} from "./editModalDateUtils";
import { EditFormData } from "./editModalTypes";

type UseEditModalParams = {
  isOpen: boolean;
  editingDocument: Document | null;
  onClose: () => void;
  onSave: (
    id: number | string,
    updatedData: Partial<Document>,
  ) => Promise<boolean>;
};

export function useEditModal({
  isOpen,
  editingDocument,
  onClose,
  onSave,
}: UseEditModalParams) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<EditFormData>(() =>
    createEditFormData(editingDocument, today),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen && !!editingDocument);

  const calendarPopoverRef = useRef<HTMLDivElement | null>(null);
  const calendarWrapperRef = useRef<HTMLDivElement | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const categoryWrapperRef = useRef<HTMLDivElement | null>(null);
  const categoryChevronRef = useRef<HTMLSpanElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCalendarOpen || !calendarPopoverRef.current) return;

    gsap.fromTo(
      calendarPopoverRef.current,
      { autoAlpha: 0, y: -8, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      },
    );
  }, [isCalendarOpen]);

  useEffect(() => {
    if (!isCategoryOpen || !categoryDropdownRef.current) return;

    gsap.fromTo(
      categoryDropdownRef.current,
      { autoAlpha: 0, y: -6, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.18,
        ease: "power2.out",
      },
    );
  }, [isCategoryOpen]);

  useEffect(() => {
    if (!categoryChevronRef.current) return;

    gsap.to(categoryChevronRef.current, {
      rotate: isCategoryOpen ? 180 : 0,
      duration: 0.18,
      ease: "power2.out",
    });
  }, [isCategoryOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (
        isCategoryOpen &&
        categoryWrapperRef.current &&
        !categoryWrapperRef.current.contains(targetNode)
      ) {
        setIsCategoryOpen(false);
      }

      if (
        isCalendarOpen &&
        calendarWrapperRef.current &&
        !calendarWrapperRef.current.contains(targetNode)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isCategoryOpen, isCalendarOpen]);

  useEffect(() => {
    if (isOpen && editingDocument) {
      const frameId = requestAnimationFrame(() => {
        setShouldRender(true);
      });

      return () => cancelAnimationFrame(frameId);
    }
  }, [isOpen, editingDocument]);

  useEffect(() => {
    if (!shouldRender || !overlayRef.current || !modalRef.current) return;

    if (isOpen && editingDocument) {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      gsap.set(modalRef.current, { autoAlpha: 0, y: 12, scale: 0.98 });

      const openTimeline = gsap.timeline();
      openTimeline
        .to(overlayRef.current, {
          autoAlpha: 1,
          duration: 0.2,
          ease: "power2.out",
        })
        .to(
          modalRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.24,
            ease: "power2.out",
          },
          "<",
        );

      return () => {
        openTimeline.kill();
      };
    }

    const closeTimeline = gsap.timeline({
      onComplete: () => setShouldRender(false),
    });

    closeTimeline
      .to(modalRef.current, {
        autoAlpha: 0,
        y: 8,
        scale: 0.98,
        duration: 0.16,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: 0.16,
          ease: "power2.in",
        },
        "<",
      );

    return () => {
      closeTimeline.kill();
    };
  }, [isOpen, editingDocument, shouldRender]);

  const handleCloseWithAnimation = () => {
    if (!overlayRef.current || !modalRef.current) {
      onClose();
      return;
    }

    const closeTimeline = gsap.timeline({ onComplete: onClose });
    closeTimeline
      .to(modalRef.current, {
        autoAlpha: 0,
        y: 8,
        scale: 0.98,
        duration: 0.16,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: 0.16,
          ease: "power2.in",
        },
        "<",
      );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeCategoryWithAnimation = () => {
    if (!categoryDropdownRef.current) {
      setIsCategoryOpen(false);
      return;
    }

    gsap.to(categoryDropdownRef.current, {
      autoAlpha: 0,
      y: -6,
      scale: 0.98,
      duration: 0.14,
      ease: "power2.in",
      onComplete: () => setIsCategoryOpen(false),
    });
  };

  const toggleCategory = () => {
    if (isCategoryOpen) {
      closeCategoryWithAnimation();
      return;
    }

    setIsCategoryOpen(true);
  };

  const selectCategory = (kategori: "Lampiran" | "Keuangan") => {
    setFormData((prev) => ({
      ...prev,
      kategori,
    }));
    closeCategoryWithAnimation();
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  const selectDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setFormData((prev) => ({
      ...prev,
      tanggal_sppd: fromDateToString(selectedDate),
    }));
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingDocument) return;
    if (!formData.kategori) return;

    setIsSaving(true);
    try {
      const isSaved = await onSave(editingDocument.id, {
        nama_sppd: formData.nama_sppd,
        kategori: formData.kategori,
        tanggal_sppd: formData.tanggal_sppd || today,
      });

      if (isSaved) {
        handleCloseWithAnimation();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    today,
    formData,
    isSaving,
    shouldRender,
    isCalendarOpen,
    isCategoryOpen,
    overlayRef,
    modalRef,
    calendarPopoverRef,
    calendarWrapperRef,
    categoryDropdownRef,
    categoryWrapperRef,
    categoryChevronRef,
    handleCloseWithAnimation,
    handleInputChange,
    toggleCategory,
    selectCategory,
    toggleCalendar,
    selectDate,
    handleSubmit,
    formatDisplayDate: (dateValue: string) =>
      formatDisplayDate(dateValue, today),
    toDateObject: (dateValue: string) => toDateObject(dateValue, today),
  };
}
