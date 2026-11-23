/**
 * ==========================================================================
 * KOLABORACAMPUS — GLOBAL SCRIPT (SIMPLE VANILLA JS)
 * Mengelola navigasi mobile, modal aksesibel, dan toast status (ARIA)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ------------------------------------------------------------------------
  // 1. TOGGLE MENU NAVIGASI MOBILE (Replikasi Header.jsx)
  // ------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-nav-drawer");

  function closeMobileMenu() {
    if (!mobileToggleBtn || !mobileDrawer) return;
    mobileToggleBtn.classList.remove("is-open");
    mobileDrawer.classList.remove("is-open");
    mobileToggleBtn.setAttribute("aria-expanded", "false");
    mobileToggleBtn.setAttribute("aria-label", "Buka menu");
  }

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("is-open");
      mobileToggleBtn.classList.toggle("is-open", isOpen);
      mobileToggleBtn.setAttribute("aria-expanded", String(isOpen));
      mobileToggleBtn.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu" : "Buka menu"
      );
    });

    // Tutup otomatis jika layar diperbesar ke desktop (>= 768px)
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. UTILITAS TOAST STATUS (ARIA LIVE REGION)
  // ------------------------------------------------------------------------
  const toastEl = document.getElementById("status-toast");
  const toastTitleEl = document.getElementById("status-toast-title");
  const toastMsgEl = document.getElementById("status-toast-message");
  let toastTimer = null;

  window.showStatusToast = function (title, message) {
    if (!toastEl || !toastTitleEl || !toastMsgEl) return;
    if (toastTimer) clearTimeout(toastTimer);

    toastTitleEl.textContent = title;
    toastMsgEl.textContent = message;
    toastEl.classList.add("is-open");

    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove("is-open");
    }, 3500);
  };

  // Tombol Notifikasi & Profil di Header
  const notprofBtn = document.getElementById("notprof-btn");
  if (notprofBtn) {
    notprofBtn.addEventListener("click", () => {
      window.showStatusToast(
        "Profil & Notifikasi",
        "Masuk sebagai Arya (SSO Universitas Brawijaya)."
      );
    });
  }

  // ------------------------------------------------------------------------
  // 3. UTILITAS MODAL / DIALOG GLOBAL (Klik Backdrop & Tombol Escape)
  // ------------------------------------------------------------------------
  window.openModal = function (modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  window.closeModal = function (modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  // Tutup modal saat klik area gelap di luar kartu atau tombol [data-close-modal]
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        window.closeModal(overlay);
      }
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetOverlay = btn.closest(".modal-overlay");
      window.closeModal(targetOverlay);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal-overlay.is-open").forEach((overlay) => {
        window.closeModal(overlay);
      });
    }
  });
});

/* ==========================================================================
   INTERAKTIVITAS BERANDA & DIALOG BUAT TIM (Konversi JSX -> Simple JS)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ------------------------------------------------------------------------
  // 1. CAROUSEL INFO TERBARU (Auto-play 4 detik + jeda saat hover)
  // ------------------------------------------------------------------------
  const carouselEl = document.getElementById("info-carousel");
  const carouselTrack = document.getElementById("info-carousel-track");
  const carouselDots = document.querySelectorAll(".carousel-dot");

  if (carouselEl && carouselTrack && carouselDots.length > 0) {
    let activeSlide = 0;
    const totalSlides = carouselDots.length;
    let isPaused = false;

    function goToSlide(index) {
      activeSlide = (index + totalSlides) % totalSlides;
      carouselTrack.style.transform = `translateX(-${activeSlide * 100}%)`;

      carouselDots.forEach((dot, idx) => {
        const isCurrent = idx === activeSlide;
        dot.classList.toggle("is-active", isCurrent);
        dot.setAttribute("aria-selected", String(isCurrent));
      });
    }

    carouselDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.slideIndex);
        goToSlide(idx);
      });
    });

    carouselEl.addEventListener("mouseenter", () => {
      isPaused = true;
    });

    carouselEl.addEventListener("mouseleave", () => {
      isPaused = false;
    });

    window.setInterval(() => {
      if (!isPaused && totalSlides > 1) {
        goToSlide(activeSlide + 1);
      }
    }, 4000);
  }

  // ------------------------------------------------------------------------
  // 2. PENCARIAN & FILTER KATEGORI LOMBA (Beranda)
  // ------------------------------------------------------------------------
  const searchForm = document.getElementById("beranda-search-form");
  const searchInput = document.getElementById("beranda-search-input");
  const categoryButtons = document.querySelectorAll("#lomba-category-filters .category-pill");
  const lihatSemuaBtn = document.getElementById("btn-lihat-semua-lomba");
  const lombaCards = document.querySelectorAll("#lomba-grid .lomba-card");
  const emptyStateEl = document.getElementById("lomba-empty-state");
  const filterStatusEl = document.getElementById("lomba-filter-status");

  if (lombaCards.length > 0) {
    let activeCategory = "Semua";

    function applyLombaFilter() {
      const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
      let visibleCount = 0;

      lombaCards.forEach((card) => {
        const category = card.dataset.category || "";
        const keywords = card.dataset.keywords || "";
        const matchCategory = activeCategory === "Semua" || category === activeCategory;
        const matchSearch = !keyword || keywords.includes(keyword);
        const isMatch = matchCategory && matchSearch;

        card.classList.toggle("is-hidden", !isMatch);
        if (isMatch) visibleCount += 1;
      });

      if (emptyStateEl) {
        emptyStateEl.classList.toggle("is-hidden", visibleCount > 0);
      }
      if (filterStatusEl) {
        filterStatusEl.textContent = `Menampilkan ${visibleCount} lomba.`;
      }
    }

    function setCategory(nextCategory) {
      activeCategory = nextCategory;
      categoryButtons.forEach((btn) => {
        const isSelected = btn.dataset.category === activeCategory;
        btn.classList.toggle("is-active", isSelected);
        btn.setAttribute("aria-pressed", String(isSelected));
      });
      applyLombaFilter();
    }

    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setCategory(btn.dataset.category || "Semua");
      });
    });

    if (lihatSemuaBtn) {
      lihatSemuaBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        setCategory("Semua");
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyLombaFilter);
    }

    if (searchForm) {
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        applyLombaFilter();
      });
    }
  }

  // ------------------------------------------------------------------------
  // 3. DIALOG DETAIL LOMBA (DetailLombaDialog.jsx)
  // ------------------------------------------------------------------------
  const LOMBA_DATA = {
    "1": {
      category: "Teknologi",
      title: "GEMASTIK XVII",
      organizer: "Puspresnas",
      deadlineText: "18 hari lagi",
      teamsFormed: 4,
      openPositions: 2,
      roles: ["Frontend", "Data Analyst"],
      variant: "teal",
      description:
        "Kompetisi nasional untuk mengembangkan solusi inovatif, terukur, dan berdampak. Peserta bekerja dalam tim lintas disiplin dan dapat mengajukan dosen pembimbing.",
      requirements: [
        "3–5 anggota aktif dari perguruan tinggi",
        "Maksimal satu dosen pembimbing per tim",
        "Proposal awal wajib diunggah sebelum pendaftaran",
      ],
    },
    "2": {
      category: "Bisnis",
      title: "L'Oréal Brandstorm",
      organizer: "L'Oréal Indonesia",
      deadlineText: "24 hari lagi",
      teamsFormed: 3,
      openPositions: 2,
      roles: ["Pitch Deck", "Market Research"],
      variant: "amber",
      description:
        "Kompetisi inovasi bisnis internasional untuk merancang strategi produk dan pengalaman konsumen masa depan.",
      requirements: [
        "3 anggota mahasiswa aktif lintas jurusan",
        "Maksimal satu dosen pembimbing per tim",
        "Pitch deck wajib dalam bahasa Inggris",
      ],
    },
    "3": {
      category: "Desain",
      title: "Kreasi UI/UX Nasional",
      organizer: "Asosiasi Digital",
      deadlineText: "31 hari lagi",
      teamsFormed: 2,
      openPositions: 1,
      roles: ["UI Designer"],
      variant: "purple",
      description:
        "Kompetisi perancangan antarmuka dan pengalaman pengguna untuk menjawab tantangan produk digital di Indonesia.",
      requirements: [
        "2–3 anggota aktif dari perguruan tinggi yang sama",
        "Melampirkan prototipe interaktif Figma",
        "Dokumen studi kasus maksimal 15 halaman",
      ],
    },
  };

  const detailModal = document.getElementById("detail-lomba-modal");
  const detailCard = document.getElementById("detail-lomba-card");

  if (detailModal && detailCard) {
    document.querySelectorAll("[data-open-detail]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.openDetail;
        const item = LOMBA_DATA[id];
        if (!item) return;

        // Salin ikon SVG dari kartu lomba asal secara aman
        const sourceCard = btn.closest(".lomba-card");
        const sourceIcon = sourceCard ? sourceCard.querySelector(".lomba-icon-circle svg") : null;
        const targetIconWrap = document.getElementById("detail-lomba-icon");
        if (targetIconWrap) {
          targetIconWrap.replaceChildren();
          if (sourceIcon) {
            targetIconWrap.appendChild(sourceIcon.cloneNode(true));
          }
        }

        detailCard.className = `modal-card modal-detail-card variant-${item.variant}`;
        document.getElementById("detail-lomba-category").textContent = item.category;
        document.getElementById("dialog-lomba-title").textContent = item.title;
        document.getElementById("detail-lomba-organizer").textContent = item.organizer;
        document.getElementById("detail-lomba-deadline").textContent = item.deadlineText;
        document.getElementById("detail-lomba-teams").textContent = `${item.teamsFormed} tim`;
        document.getElementById("detail-lomba-open").textContent = `${item.openPositions} posisi`;
        document.getElementById("detail-lomba-desc").textContent = item.description;
        document.getElementById("detail-summary-teams").textContent = `${item.teamsFormed} tim`;
        document.getElementById("detail-summary-open").textContent = `${item.openPositions} posisi`;
        document.getElementById("detail-summary-roles").textContent = item.roles.join(" · ");

        const reqList = document.getElementById("detail-lomba-req");
        reqList.replaceChildren();
        item.requirements.forEach((reqText) => {
          const li = document.createElement("li");
          li.textContent = reqText;
          reqList.appendChild(li);
        });

        window.openModal(detailModal);
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. DIALOG BUAT TIM BARU (Dipakai lintas halaman)
  // ------------------------------------------------------------------------
  const buatTimModal = document.getElementById("buat-tim-modal");
  const buatTimForm = document.getElementById("buat-tim-form");
  const positionsList = document.getElementById("positions-list");
  const addPositionBtn = document.getElementById("btn-add-position");
  const kondisiRadios = document.querySelectorAll('input[name="kondisi_dosen"]');
  const kondisiHint = document.getElementById("kondisi-dosen-hint");

  if (buatTimModal) {
    document.querySelectorAll("[data-open-buat-tim]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.openModal(buatTimModal);
      });
    });
  }

  function createPositionRow(removable) {
    const row = document.createElement("div");
    row.className = "position-row";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "posisi_nama[]";
    nameInput.required = true;
    nameInput.placeholder = "Contoh: Backend Developer";
    nameInput.setAttribute("aria-label", "Nama posisi");
    nameInput.className = "form-control position-input-name";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.name = "posisi_jumlah[]";
    qtyInput.min = "1";
    qtyInput.max = "10";
    qtyInput.value = "1";
    qtyInput.setAttribute("aria-label", "Jumlah posisi");
    qtyInput.className = "form-control position-input-qty";

    row.appendChild(nameInput);
    row.appendChild(qtyInput);

    if (removable) {
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-remove-pos";
      delBtn.setAttribute("aria-label", "Hapus posisi");
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => {
        row.remove();
      });
      row.appendChild(delBtn);
    }

    return row;
  }

  if (addPositionBtn && positionsList) {
    addPositionBtn.addEventListener("click", () => {
      positionsList.appendChild(createPositionRow(true));
    });
  }

  function syncKondisiDosenUI() {
    kondisiRadios.forEach((radio) => {
      const card = radio.closest(".radio-card");
      if (card) {
        card.classList.toggle("is-selected", radio.checked);
      }
      if (radio.checked && kondisiHint) {
        kondisiHint.textContent =
          radio.value === "belum"
            ? 'Tim akan ditandai "Mencari dosen pembimbing".'
            : "Tim akan ditandai sudah memiliki dosen pembimbing.";
      }
    });
  }

  kondisiRadios.forEach((radio) => {
    radio.addEventListener("change", syncKondisiDosenUI);
  });

  if (buatTimForm && buatTimModal) {
    buatTimForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const namaTimInput = document.getElementById("nama-tim");
      const namaTim = namaTimInput ? namaTimInput.value.trim() : "Tim Baru";

      buatTimForm.reset();
      if (positionsList) {
        positionsList.replaceChildren(createPositionRow(false));
      }
      syncKondisiDosenUI();
      window.closeModal(buatTimModal);

      if (typeof window.showStatusToast === "function") {
        window.showStatusToast(
          "Tim berhasil dibuat",
          `${namaTim} telah ditambahkan dan siap dikelola di halaman Tim Saya.`
        );
      }
    });
  }
});