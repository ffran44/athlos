"use client";

import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { testimonios } from "@/content/site";
import { TestimonialCard } from "./TestimonialCard";
import styles from "./Testimonials.module.css";

/** Carrusel con Swiper. Se carga solo en el navegador (ver Testimonials.tsx). */
export default function Carousel({ onReady, onMove }: { onReady: (s: SwiperType) => void; onMove: (s: SwiperType) => void }) {
  return (
    <Swiper
      className={`columna ${styles.swiper}`}
      modules={[Keyboard, A11y]}
      slidesPerView="auto"
      spaceBetween={16}
      grabCursor
      watchSlidesProgress
      keyboard={{ enabled: true, onlyInViewport: true }}
      a11y={{
        prevSlideMessage: "Testimonio anterior",
        nextSlideMessage: "Testimonio siguiente",
        slideLabelMessage: "Testimonio {{index}} de {{slidesLength}}",
      }}
      onSwiper={(s) => {
        onReady(s);
        onMove(s);
      }}
      onProgress={onMove}
      onResize={onMove}
    >
      {testimonios.map((t, i) => (
        <SwiperSlide key={i} className={`columna-borde ${styles.slide}`}>
          <TestimonialCard t={t} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
