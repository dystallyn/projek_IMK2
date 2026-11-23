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

/* ==========================================================================
   INTERAKTIVITAS JELAJAH TIM & CARI ANGGOTA (Simple Vanilla JS)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ------------------------------------------------------------------------
  // 1. HALAMAN JELAJAH TIM (Filter, DetailTimDialog, Ajukan, & Tambah Tim)
  // ------------------------------------------------------------------------
  const timGrid = document.getElementById("tim-grid");

  if (timGrid) {
    const TIM_DATA = {
      "1": {
        id: "1",
        competition: "GEMASTIK XVII",
        name: "NusaVerse",
        creatorName: "Rizky Maulana",
        creatorRole: "Mahasiswa",
        advisor: "Dr. Budi Santoso",
        currentMembers: 3,
        maxMembers: 5,
        description:
          "Mengembangkan dashboard mitigasi banjir berbasis data sensor dan prediksi real-time.",
        positions: [
          { role: "Frontend Developer", count: 1 },
          { role: "Data Analyst", count: 1 },
        ],
        members: [
          { initials: "RM", name: "Rizky Maulana", isLeader: true, role: "Product Manager", major: "Sistem Informasi 2022" },
          { initials: "AD", name: "Alya Damayanti", isLeader: false, role: "IoT Engineer", major: "Teknik Elektro 2021" },
          { initials: "SK", name: "Satria Kusuma", isLeader: false, role: "UI/UX Designer", major: "Desain Komunikasi Visual 2022" },
        ],
        variant: "teal",
      },
      "2": {
        id: "2",
        competition: "L'Oréal Brandstorm",
        name: "EcoMinds Lab",
        creatorName: "Dr. Maya Anggraini",
        creatorRole: "Dosen",
        advisor: "Dr. Maya Anggraini",
        currentMembers: 2,
        maxMembers: 4,
        description:
          "Merancang konsep produk perawatan ramah lingkungan dengan pendekatan ekonomi sirkular.",
        positions: [
          { role: "Business Strategist", count: 1 },
          { role: "Pitch Designer", count: 1 },
        ],
        members: [
          { initials: "MA", name: "Dr. Maya Anggraini", isLeader: true, role: "Pembimbing & Inisiator", major: "Manajemen Bisnis" },
          { initials: "DN", name: "Dimas Nugraha", isLeader: false, role: "Market Researcher", major: "Ilmu Ekonomi 2022" },
        ],
        variant: "amber",
      },
      "3": {
        id: "3",
        competition: "Kreasi UI/UX Nasional",
        name: "Ruang Reka",
        creatorName: "Nabila Vina",
        creatorRole: "Mahasiswa",
        advisor: "Dr. Maya Anggraini",
        currentMembers: 2,
        maxMembers: 3,
        description:
          "Membangun pengalaman aplikasi aksesibel untuk membantu mahasiswa difabel di lingkungan kampus.",
        positions: [{ role: "UX Researcher", count: 1 }],
        members: [
          { initials: "NV", name: "Nabila Vina", isLeader: true, role: "UI Designer", major: "Teknik Informatika 2023" },
          { initials: "FR", name: "Fajar Ramadhan", isLeader: false, role: "Interaction Designer", major: "Sistem Informasi 2023" },
        ],
        variant: "purple",
      },
    };

    const VARIANT_BY_LOMBA = {
      "GEMASTIK XVII": "teal",
      "L'Oréal Brandstorm": "amber",
      "Kreasi UI/UX Nasional": "purple",
    };

    const AVATAR_CLASSES = [
      "avatar-pink",
      "avatar-amber",
      "avatar-gray",
      "avatar-teal",
      "avatar-purple",
    ];

    const appliedTimIds = new Set();
    let currentTimId = null;

    const searchForm = document.getElementById("jelajah-search-form");
    const searchInput = document.getElementById("jelajah-search-input");
    const skillSelect = document.getElementById("filter-keahlian");
    const compSelect = document.getElementById("filter-kompetisi");
    const emptyState = document.getElementById("tim-empty-state");
    const statusEl = document.getElementById("tim-filter-status");

    function applyTimFilter() {
      const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
      const selectedSkill = skillSelect ? skillSelect.value : "Semua Keahlian";
      const selectedComp = compSelect ? compSelect.value : "Semua Lomba";
      const cards = timGrid.querySelectorAll(".tim-card");
      let visibleCount = 0;

      cards.forEach((card) => {
        const keywords = (card.dataset.keywords || "").toLowerCase();
        const skills = (card.dataset.skills || "").split("|");
        const competition = card.dataset.competition || "";

        const matchSearch = !keyword || keywords.includes(keyword);
        const matchSkill = selectedSkill === "Semua Keahlian" || skills.includes(selectedSkill);
        const matchComp = selectedComp === "Semua Lomba" || competition === selectedComp;
        const isMatch = matchSearch && matchSkill && matchComp;

        card.classList.toggle("is-hidden", !isMatch);
        if (isMatch) visibleCount += 1;
      });

      if (emptyState) emptyState.classList.toggle("is-hidden", visibleCount > 0);
      if (statusEl) statusEl.textContent = `Menampilkan ${visibleCount} tim terbuka.`;
    }

    if (searchInput) searchInput.addEventListener("input", applyTimFilter);
    if (skillSelect) skillSelect.addEventListener("change", applyTimFilter);
    if (compSelect) compSelect.addEventListener("change", applyTimFilter);
    if (searchForm) {
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        applyTimFilter();
      });
    }

    // Dialog Detail Tim
    const detailTimModal = document.getElementById("detail-tim-modal");
    const applyTimBtn = document.getElementById("btn-apply-tim");

    function syncApplyButton(timId) {
      if (!applyTimBtn) return;
      const isApplied = appliedTimIds.has(timId);
      applyTimBtn.disabled = isApplied;
      applyTimBtn.textContent = isApplied ? "✓ Pengajuan terkirim" : "Ajukan bergabung →";
    }

    function openTimDetail(timId) {
      const tim = TIM_DATA[timId];
      if (!tim || !detailTimModal) return;
      currentTimId = timId;

      document.getElementById("detail-tim-comp").textContent = tim.competition;
      document.getElementById("detail-tim-title").textContent = tim.name;
      document.getElementById("detail-tim-creator").textContent = `Dibuka oleh ${tim.creatorName} · ${tim.creatorRole}`;
      document.getElementById("detail-tim-desc").textContent = tim.description || "Deskripsi tim belum tersedia.";
      document.getElementById("detail-tim-count-badge").textContent = `${tim.currentMembers}/${tim.maxMembers} anggota`;

      // Banner Pembimbing
      const banner = document.getElementById("detail-tim-advisor-banner");
      const advHeading = document.getElementById("detail-tim-advisor-heading");
      const advName = document.getElementById("detail-tim-advisor-name");
      const advBadge = document.getElementById("detail-tim-advisor-badge");

      if (tim.advisor) {
        banner.classList.remove("is-searching");
        advHeading.textContent = "Sudah memiliki dosen pembimbing";
        advName.textContent = tim.advisor;
        advBadge.classList.remove("is-hidden");
      } else {
        banner.classList.add("is-searching");
        advHeading.textContent = "Mencari dosen pembimbing";
        advName.textContent = "Tim ini belum memiliki dosen pembimbing terkonfirmasi.";
        advBadge.classList.add("is-hidden");
      }

      // Posisi dibutuhkan
      const posListEl = document.getElementById("detail-tim-positions");
      posListEl.replaceChildren();
      tim.positions.forEach((pos) => {
        const li = document.createElement("li");
        li.className = "tim-pos-item";

        const roleSpan = document.createElement("span");
        roleSpan.className = "tim-pos-role";
        roleSpan.textContent = pos.role;

        const qtySpan = document.createElement("span");
        qtySpan.className = "tim-pos-qty";
        qtySpan.textContent = `${pos.count} orang`;

        li.appendChild(roleSpan);
        li.appendChild(qtySpan);
        posListEl.appendChild(li);
      });

      // Anggota tim
      const membersEl = document.getElementById("detail-tim-members");
      membersEl.replaceChildren();
      tim.members.forEach((member, index) => {
        const item = document.createElement("div");
        item.className = "member-item";

        const avatar = document.createElement("div");
        avatar.className = `member-avatar ${AVATAR_CLASSES[index % AVATAR_CLASSES.length]}`;
        avatar.textContent = member.initials;

        const info = document.createElement("div");
        const nameRow = document.createElement("div");
        nameRow.className = "member-name-row";

        const nameP = document.createElement("p");
        nameP.className = "member-name";
        nameP.textContent = member.name;
        nameRow.appendChild(nameP);

        if (member.isLeader) {
          const leader = document.createElement("span");
          leader.className = "leader-badge";
          leader.textContent = "Ketua";
          nameRow.appendChild(leader);
        }

        const roleP = document.createElement("p");
        roleP.className = "member-role";
        roleP.textContent = member.role;

        const majorP = document.createElement("p");
        majorP.className = "member-major";
        majorP.textContent = member.major;

        info.appendChild(nameRow);
        info.appendChild(roleP);
        info.appendChild(majorP);

        item.appendChild(avatar);
        item.appendChild(info);
        membersEl.appendChild(item);
      });

      syncApplyButton(timId);
      window.openModal(detailTimModal);
    }

    // Event Delegation untuk tombol "Lihat tim"
    timGrid.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-open-tim-detail]");
      if (!btn) return;
      openTimDetail(btn.dataset.openTimDetail);
    });

    if (applyTimBtn) {
      applyTimBtn.addEventListener("click", () => {
        if (!currentTimId || appliedTimIds.has(currentTimId)) return;
        appliedTimIds.add(currentTimId);
        syncApplyButton(currentTimId);

        const tim = TIM_DATA[currentTimId];
        if (tim && typeof window.showStatusToast === "function") {
          window.showStatusToast(
            "Pengajuan terkirim",
            `Permintaan bergabung ke tim ${tim.name} berhasil dikirim.`
          );
        }
      });
    }

    // Tangkap pembuatan tim baru dari BuatTimDialog sebelum form di-reset (capture phase)
    const buatTimModal = document.getElementById("buat-tim-modal");
    if (buatTimModal) {
      buatTimModal.addEventListener(
        "submit",
        (event) => {
          if (event.target.id !== "buat-tim-form") return;

          const namaTim = (document.getElementById("nama-tim")?.value || "").trim();
          const lomba = document.getElementById("lomba-diikuti")?.value || "GEMASTIK XVII";
          const pembuka = document.getElementById("pembuka-tim")?.value || "Saya sebagai mahasiswa";
          const kondisiRadio = buatTimModal.querySelector('input[name="kondisi_dosen"]:checked');
          const kondisi = kondisiRadio ? kondisiRadio.value : "belum";

          const posNames = Array.from(buatTimModal.querySelectorAll('input[name="posisi_nama[]"]'));
          const posQtys = Array.from(buatTimModal.querySelectorAll('input[name="posisi_jumlah[]"]'));
          const positions = posNames
            .map((input, idx) => ({
              role: input.value.trim(),
              count: Math.max(1, Number(posQtys[idx]?.value) || 1),
            }))
            .filter((p) => p.role !== "");

          if (!namaTim) return;

          const newId = String(Date.now());
          const variant = VARIANT_BY_LOMBA[lomba] || "teal";
          const creatorRole = pembuka.toLowerCase().includes("dosen") ? "Dosen" : "Mahasiswa";
          const advisor = kondisi === "sudah" ? "Sudah ditentukan" : "";

          TIM_DATA[newId] = {
            id: newId,
            competition: lomba,
            name: namaTim,
            creatorName: "Kamu",
            creatorRole,
            advisor,
            currentMembers: 1,
            maxMembers: 5,
            description: "Tim baru yang dibuat melalui KolaboraCampus.",
            positions,
            members: [
              { initials: "AR", name: "Arya (Kamu)", isLeader: true, role: "Ketua Tim", major: "Universitas Brawijaya" },
            ],
            variant,
          };

          // Buat elemen kartu tim baru secara aman via DOM API
          const card = document.createElement("article");
          card.className = `tim-card variant-${variant}`;
          card.dataset.timId = newId;
          card.dataset.competition = lomba;
          card.dataset.skills = positions.map((p) => p.role).join("|");
          card.dataset.keywords = `${namaTim} kamu ${lomba} ${positions.map((p) => p.role).join(" ")}`.toLowerCase();

          const accent = document.createElement("div");
          accent.className = "tim-card-accent";

          const body = document.createElement("div");
          body.className = "tim-card-body";

          const topWrap = document.createElement("div");
          const topRow = document.createElement("div");
          topRow.className = "lomba-card-top";

          const iconCircle = document.createElement("div");
          iconCircle.className = `lomba-icon-circle${variant === "amber" ? " is-tim-amber" : ""}`;
          iconCircle.textContent = "👥";

          const badge = document.createElement("span");
          badge.className = "lomba-badge";
          badge.textContent = lomba;
          topRow.append(iconCircle, badge);

          const heading = document.createElement("div");
          heading.className = "lomba-heading";
          const h3 = document.createElement("h3");
          h3.className = "lomba-title";
          h3.textContent = namaTim;
          const creatorP = document.createElement("p");
          creatorP.className = "tim-creator";
          creatorP.textContent = `Dibuka oleh Kamu · ${creatorRole}`;
          heading.append(h3, creatorP);

          const hr1 = document.createElement("hr");
          hr1.className = "card-divider";

          const advDiv = document.createElement("div");
          advDiv.className = `tim-advisor ${advisor ? "is-confirmed" : "is-searching"}`;
          advDiv.textContent = advisor ? `✓ Pembimbing: ${advisor}` : "🔍 Mencari dosen pembimbing";

          const hr2 = document.createElement("hr");
          hr2.className = "card-divider";

          const memRow = document.createElement("div");
          memRow.className = "tim-member-row";
          const memLabel = document.createElement("span");
          memLabel.className = "lomba-stat-label";
          memLabel.textContent = "Anggota Saat Ini";
          const memCount = document.createElement("span");
          memCount.className = "tim-member-count";
          memCount.textContent = "1/5 anggota";
          memRow.append(memLabel, memCount);

          const hr3 = document.createElement("hr");
          hr3.className = "card-divider";

          const posWrap = document.createElement("div");
          const posTitle = document.createElement("p");
          posTitle.className = "lomba-stat-label";
          posTitle.textContent = "Posisi Dibutuhkan";
          const posUl = document.createElement("ul");
          posUl.className = "tim-pos-list";
          positions.forEach((p) => {
            const li = document.createElement("li");
            li.className = "tim-pos-item";
            const r = document.createElement("span");
            r.className = "tim-pos-role";
            r.textContent = p.role;
            const q = document.createElement("span");
            q.className = "tim-pos-qty";
            q.textContent = `${p.count} orang`;
            li.append(r, q);
            posUl.appendChild(li);

            // Tambahkan ke dropdown filter jika keahlian belum ada
            if (skillSelect && !Array.from(skillSelect.options).some((opt) => opt.value === p.role)) {
              const opt = document.createElement("option");
              opt.value = p.role;
              opt.textContent = p.role;
              skillSelect.appendChild(opt);
            }
          });
          posWrap.append(posTitle, posUl);

          topWrap.append(topRow, heading, hr1, advDiv, hr2, memRow, hr3, posWrap);

          const foot = document.createElement("div");
          foot.className = "tim-card-footer";
          const hr4 = document.createElement("hr");
          hr4.className = "card-divider";
          const viewBtn = document.createElement("button");
          viewBtn.type = "button";
          viewBtn.className = "lomba-btn-primary";
          viewBtn.dataset.openTimDetail = newId;
          viewBtn.textContent = "Lihat tim →";
          foot.append(hr4, viewBtn);

          body.append(topWrap, foot);
          card.append(accent, body);
          timGrid.prepend(card);
          applyTimFilter();
        },
        true
      );
    }
  }

  // ------------------------------------------------------------------------
  // 2. HALAMAN CARI ANGGOTA (Filter Dosen/Mahasiswa & Kirim Pengajuan)
  // ------------------------------------------------------------------------
  const kandidatSearchInput = document.getElementById("kandidat-search-input");

  if (kandidatSearchInput) {
    const kandidatForm = document.getElementById("kandidat-search-form");
    const skillSelect = document.getElementById("filter-keahlian-kandidat");
    const compSelect = document.getElementById("filter-kompetisi-kandidat");
    const dosenCards = document.querySelectorAll('#dosen-list .kandidat-card');
    const mhsCards = document.querySelectorAll('#mahasiswa-list .kandidat-card');
    const dosenEmpty = document.getElementById("dosen-empty-state");
    const mhsEmpty = document.getElementById("mahasiswa-empty-state");
    const statusEl = document.getElementById("kandidat-filter-status");

    function filterCards(cardList, emptyEl) {
      const keyword = kandidatSearchInput.value.trim().toLowerCase();
      const selectedSkill = skillSelect ? skillSelect.value : "Semua Keahlian";
      const selectedComp = compSelect ? compSelect.value : "Semua Lomba";
      let visibleCount = 0;

      cardList.forEach((card) => {
        const keywords = (card.dataset.keywords || "").toLowerCase();
        const skills = (card.dataset.skills || "").split("|");
        const comps = (card.dataset.competitions || "").split("|");

        const matchSearch = !keyword || keywords.includes(keyword);
        const matchSkill = selectedSkill === "Semua Keahlian" || skills.includes(selectedSkill);
        const matchComp = selectedComp === "Semua Lomba" || comps.includes(selectedComp);
        const isMatch = matchSearch && matchSkill && matchComp;

        card.classList.toggle("is-hidden", !isMatch);
        if (isMatch) visibleCount += 1;
      });

      if (emptyEl) emptyEl.classList.toggle("is-hidden", visibleCount > 0);
      return visibleCount;
    }

    function applyKandidatFilter() {
      const dosenCount = filterCards(dosenCards, dosenEmpty);
      const mhsCount = filterCards(mhsCards, mhsEmpty);
      if (statusEl) {
        statusEl.textContent = `Menampilkan ${dosenCount} dosen dan ${mhsCount} mahasiswa.`;
      }
    }

    kandidatSearchInput.addEventListener("input", applyKandidatFilter);
    if (skillSelect) skillSelect.addEventListener("change", applyKandidatFilter);
    if (compSelect) compSelect.addEventListener("change", applyKandidatFilter);
    if (kandidatForm) {
      kandidatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        applyKandidatFilter();
      });
    }

    // Tombol Ajukan Pembimbing / Kirim Undangan
    document.querySelectorAll("[data-kandidat-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const targetName = btn.dataset.targetName || "kandidat";
        const submittedText = btn.dataset.submittedText || "✓ Terkirim";

        btn.disabled = true;
        btn.textContent = submittedText;

        if (typeof window.showStatusToast === "function") {
          window.showStatusToast(
            "Permintaan terkirim",
            `Pengajuan kepada ${targetName} telah berhasil dikirim.`
          );
        }
      });
    });

    // Tombol Lihat Profil
    document.querySelectorAll("[data-kandidat-profile]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const info = btn.dataset.kandidatProfile || "Kandidat";
        if (typeof window.showStatusToast === "function") {
          window.showStatusToast("Profil Kandidat", info);
        }
      });
    });
  }
});

/* ==========================================================================
   INTERAKTIVITAS HALAMAN TIM SAYA (Workspace Tabs & Kunci Tim)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const tabButtons = document.querySelectorAll("[data-workspace-tab]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");

  function switchWorkspaceTab(targetId) {
    if (tabButtons.length === 0 || tabPanels.length === 0) return;

    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.workspaceTab === targetId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach((panel) => {
      const isMatch = panel.dataset.tabPanel === targetId;
      panel.classList.toggle("is-hidden", !isMatch);
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchWorkspaceTab(btn.dataset.workspaceTab);
    });
  });

  document.querySelectorAll("[data-switch-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchWorkspaceTab(btn.dataset.switchTab);
    });
  });

  // Dialog Konfirmasi Kunci Tim
  const lockModal = document.getElementById("kunci-tim-modal");
  const openLockBtn = document.getElementById("btn-open-lock-dialog");
  const confirmLockBtn = document.getElementById("btn-confirm-lock-team");
  const lockPromptBox = document.getElementById("lock-team-prompt");
  const lockConfirmedBox = document.getElementById("lock-team-confirmed");
  const lockDateEl = document.getElementById("lock-confirmed-date");

  if (openLockBtn && lockModal) {
    openLockBtn.addEventListener("click", () => {
      window.openModal(lockModal);
    });
  }

  if (confirmLockBtn && lockModal) {
    confirmLockBtn.addEventListener("click", () => {
      const formattedDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (lockDateEl) {
        lockDateEl.textContent = `Susunan final dikonfirmasi pada ${formattedDate}.`;
      }
      if (lockPromptBox) lockPromptBox.classList.add("is-hidden");
      if (lockConfirmedBox) lockConfirmedBox.classList.remove("is-hidden");

      window.closeModal(lockModal);

      if (typeof window.showStatusToast === "function") {
        window.showStatusToast(
          "Team Locked",
          "Susunan Tim Aurora berhasil dikunci dan dikonfirmasi."
        );
      }
    });
  }
});

/* ==========================================================================
   INTERAKTIVITAS HALAMAN JADWAL DISKUSI (Simple Vanilla JS)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const jadwalRoot = document.getElementById("jadwal-page-root");
  if (!jadwalRoot) return;

  const HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const HARI_PANJANG = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const JAM_SLOTS = [
    { start: "19.00", range: "19.00–20.00" },
    { start: "20.00", range: "20.00–21.00" },
    { start: "16.00", range: "16.00–17.00" },
    { start: "19.00", range: "19.00–20.00" },
  ];

  function generateUpcomingSchedule(daysCount) {
    const today = new Date();
    const dates = Array.from({ length: daysCount }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index + 1);
      return date;
    });

    const first = dates[0];
    const last = dates[dates.length - 1];
    const firstMonth = first.toLocaleDateString("id-ID", { month: "long" });
    const lastMonth = last.toLocaleDateString("id-ID", { month: "long" });

    let dateRange = "";
    if (first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()) {
      dateRange = `${first.getDate()}–${last.getDate()} ${lastMonth} ${last.getFullYear()}`;
    } else if (first.getFullYear() === last.getFullYear()) {
      dateRange = `${first.getDate()} ${firstMonth}–${last.getDate()} ${lastMonth} ${last.getFullYear()}`;
    } else {
      dateRange = `${first.getDate()} ${firstMonth} ${first.getFullYear()}–${last.getDate()} ${lastMonth} ${last.getFullYear()}`;
    }

    const slots = dates.map((date, index) => {
      const dayIdx = date.getDay();
      const monthLong = date.toLocaleDateString("id-ID", { month: "long" });
      const jam = JAM_SLOTS[index % JAM_SLOTS.length];
      return {
        id: `slot-${index}`,
        day: HARI_PENDEK[dayIdx],
        time: jam.start,
        label: `${HARI_PANJANG[dayIdx]}, ${jam.range}`,
        fullLabel: `${HARI_PANJANG[dayIdx]}, ${date.getDate()} ${monthLong} · ${jam.range}`,
        recommended: index === 1,
      };
    });

    return { dateRange, slots };
  }

  const schedule = generateUpcomingSchedule(4);
  const dynamicSlots = schedule.slots;
  let myAvailableSlots = ["slot-0", "slot-1", "slot-3"];
  let selectedPickSlotId = "slot-1";
  let isScheduleConfirmed = false;

  const dateRangeInput = document.getElementById("rentang-tanggal");
  const slotsListEl = document.getElementById("availability-slots-list");
  const availabilityForm = document.getElementById("availability-form");
  const headRowEl = document.getElementById("freetime-head-row");
  const bodyEl = document.getElementById("freetime-body");
  const bestBannerEl = document.getElementById("best-slot-banner");
  const bestLabelEl = document.getElementById("best-slot-label");
  const bestCountEl = document.getElementById("best-slot-count");
  const pickGroupEl = document.getElementById("pick-slot-radiogroup");
  const confirmBtn = document.getElementById("btn-confirm-schedule");
  const resyncBtn = document.getElementById("btn-resync-jadwal");
  const lastSyncedEl = document.getElementById("last-synced-text");

  if (dateRangeInput) {
    dateRangeInput.value = schedule.dateRange;
  }

  // 1. Render Checkbox Ketersediaan Tambahan
  function renderAvailabilityCheckboxes() {
    if (!slotsListEl) return;
    slotsListEl.replaceChildren();

    dynamicSlots.forEach((slot) => {
      const label = document.createElement("label");
      label.className = "slot-check-item";
      label.htmlFor = `check-${slot.id}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `check-${slot.id}`;
      checkbox.value = slot.id;
      checkbox.checked = myAvailableSlots.includes(slot.id);
      checkbox.className = "slot-check-input";

      const text = document.createElement("span");
      text.textContent = slot.label;

      label.append(checkbox, text);
      slotsListEl.appendChild(label);
    });
  }

  // 2. Render Matriks Shared Free-Time & Slot Terbaik
  function renderSharedFreeTime() {
    if (!headRowEl || !bodyEl) return;

    const members = [
      { id: "arya", initials: "AR", name: "Arya (Kamu)", syncedInfo: "5 MK tersinkron", availableSlots: myAvailableSlots },
      { id: "nadia", initials: "NP", name: "Nadia", syncedInfo: "6 MK tersinkron", availableSlots: ["slot-0", "slot-1", "slot-2"] },
      { id: "raka", initials: "RM", name: "Raka", syncedInfo: "5 MK tersinkron", availableSlots: ["slot-1", "slot-2", "slot-3"] },
    ];
    const totalMembers = members.length;

    // Header kolom tabel
    headRowEl.replaceChildren();
    const memberTh = document.createElement("th");
    memberTh.scope = "col";
    memberTh.className = "matrix-col-member";
    memberTh.textContent = "Anggota";
    headRowEl.appendChild(memberTh);

    dynamicSlots.forEach((slot) => {
      const th = document.createElement("th");
      th.scope = "col";
      const daySpan = document.createElement("span");
      daySpan.className = "matrix-day";
      daySpan.textContent = slot.day;
      const timeSpan = document.createElement("span");
      timeSpan.className = "matrix-time";
      timeSpan.textContent = slot.time;
      th.append(daySpan, timeSpan);
      headRowEl.appendChild(th);
    });

    // Hitung jumlah anggota tersedia per slot
    const slotCounts = {};
    dynamicSlots.forEach((slot) => {
      slotCounts[slot.id] = members.filter((m) => m.availableSlots.includes(slot.id)).length;
    });

    // Baris anggota
    bodyEl.replaceChildren();
    members.forEach((member) => {
      const tr = document.createElement("tr");

      const rowTh = document.createElement("th");
      rowTh.scope = "row";

      const cellWrap = document.createElement("div");
      cellWrap.className = "matrix-member-cell";
      const av = document.createElement("div");
      av.className = "matrix-avatar";
      av.setAttribute("aria-hidden", "true");
      av.textContent = member.initials;

      const info = document.createElement("div");
      const nameP = document.createElement("p");
      nameP.className = "matrix-member-name";
      nameP.textContent = member.name;
      const metaP = document.createElement("p");
      metaP.className = "matrix-member-meta";
      metaP.textContent = member.syncedInfo;

      info.append(nameP, metaP);
      cellWrap.append(av, info);
      rowTh.appendChild(cellWrap);
      tr.appendChild(rowTh);

      dynamicSlots.forEach((slot) => {
        const td = document.createElement("td");
        td.className = "matrix-status-cell";

        const isAvail = member.availableSlots.includes(slot.id);
        const count = slotCounts[slot.id] || 0;
        let stateClass = "is-unavailable";
        if (isAvail) {
          if (count === totalMembers) stateClass = "is-full";
          else if (count >= Math.ceil(totalMembers / 2)) stateClass = "is-medium";
          else stateClass = "is-low";
        }

        const pill = document.createElement("span");
        pill.className = `matrix-pill ${stateClass}`;
        pill.title = `${member.name} - ${slot.day} ${slot.time}: ${isAvail ? "Tersedia" : "Tidak tersedia"}`;
        pill.setAttribute("aria-label", pill.title);
        pill.textContent = isAvail ? "✓" : "✕";

        td.appendChild(pill);
        tr.appendChild(td);
      });

      bodyEl.appendChild(tr);
    });

    // Cari slot terbaik
    let bestSlot = dynamicSlots[0];
    dynamicSlots.forEach((slot) => {
      if (slotCounts[slot.id] > slotCounts[bestSlot.id]) {
        bestSlot = slot;
      }
    });

    const bestCount = slotCounts[bestSlot.id] || 0;
    if (bestBannerEl) {
      bestBannerEl.classList.toggle("is-hidden", bestCount === 0);
    }
    if (bestLabelEl) bestLabelEl.textContent = bestSlot.fullLabel;
    if (bestCountEl) bestCountEl.textContent = `${bestCount}/${totalMembers} tersedia`;
  }

  // 3. Render Radio Pilihan Waktu Diskusi (3 slot pertama)
  function renderPickSlots() {
    if (!pickGroupEl) return;
    pickGroupEl.replaceChildren();

    dynamicSlots.slice(0, 3).forEach((slot) => {
      const isSelected = slot.id === selectedPickSlotId;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.role = "radio";
      btn.setAttribute("aria-checked", String(isSelected));
      btn.className = `slot-radio-btn${isSelected ? " is-selected" : ""}`;

      const daySpan = document.createElement("span");
      daySpan.className = "slot-radio-day";
      daySpan.textContent = slot.day;

      const timeSpan = document.createElement("span");
      timeSpan.className = "slot-radio-time";
      timeSpan.textContent = slot.time;

      btn.append(daySpan, timeSpan);

      if (slot.recommended) {
        const recSpan = document.createElement("span");
        recSpan.className = "slot-radio-rec";
        recSpan.textContent = "Direkomendasikan";
        btn.appendChild(recSpan);
      }

      btn.addEventListener("click", () => {
        selectedPickSlotId = slot.id;
        isScheduleConfirmed = false;
        if (confirmBtn) confirmBtn.textContent = "Konfirmasi jadwal";
        renderPickSlots();
      });

      pickGroupEl.appendChild(btn);
    });
  }

  // Event Simpan Ketersediaan
  if (availabilityForm) {
    availabilityForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const checkedInputs = slotsListEl.querySelectorAll('input[type="checkbox"]:checked');
      myAvailableSlots = Array.from(checkedInputs).map((el) => el.value);
      renderSharedFreeTime();

      if (typeof window.showStatusToast === "function") {
        window.showStatusToast(
          "Ketersediaan disimpan",
          "Matriks shared free-time Tim Aurora telah diperbarui."
        );
      }
    });
  }

  // Event Sinkron Ulang Portal Akademik UB
  if (resyncBtn) {
    resyncBtn.addEventListener("click", () => {
      resyncBtn.disabled = true;
      resyncBtn.textContent = "Menyinkronkan...";

      window.setTimeout(() => {
        const now = new Date();
        const jam = String(now.getHours()).padStart(2, "0");
        const menit = String(now.getMinutes()).padStart(2, "0");
        if (lastSyncedEl) lastSyncedEl.textContent = `Hari ini, ${jam}.${menit}`;
        resyncBtn.disabled = false;
        resyncBtn.textContent = "✓ Sinkron ulang";

        if (typeof window.showStatusToast === "function") {
          window.showStatusToast(
            "Jadwal tersinkronisasi",
            "Jadwal kuliah seluruh anggota berhasil diperbarui."
          );
        }
      }, 600);
    });
  }

  // Event Konfirmasi Jadwal
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const slot = dynamicSlots.find((s) => s.id === selectedPickSlotId) || dynamicSlots[0];
      if (!slot) return;

      isScheduleConfirmed = true;
      confirmBtn.textContent = "✓ Jadwal dikonfirmasi";

      if (typeof window.showStatusToast === "function") {
        window.showStatusToast(
          "Jadwal dikonfirmasi",
          `Diskusi Tim Aurora dijadwalkan pada ${slot.fullLabel}.`
        );
      }
    });
  }

  renderAvailabilityCheckboxes();
  renderSharedFreeTime();
  renderPickSlots();
});

/* ==========================================================================
   INTERAKTIVITAS HALAMAN DOSEN PEMBIMBING (Simple Vanilla JS)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const dosenRoot = document.getElementById("dosen-page-root");
  if (!dosenRoot) return;

  const searchInput = document.getElementById("dosen-search-input");
  const searchStatus = document.getElementById("dosen-search-status");
  const dosenCards = document.querySelectorAll("#dosen-cards-grid .dosen-card");
  const emptyEl = document.getElementById("dosen-page-empty");

  const formEl = document.getElementById("pengajuan-pembimbing-form");
  const dosenTujuanInput = document.getElementById("dosen-tujuan");
  const topikInput = document.getElementById("judul-topik");
  const pesanInput = document.getElementById("pesan-pengajuan");
  const charCountEl = document.getElementById("pesan-char-count");
  const fileInput = document.getElementById("proposal-file-input");
  const changeFileBtn = document.getElementById("btn-change-proposal");
  const fileNameEl = document.getElementById("proposal-file-name");
  const fileMetaEl = document.getElementById("proposal-file-meta");
  const submitBtn = document.getElementById("btn-submit-pengajuan");

  const step2Dot = document.getElementById("step2-dot");
  const step2Title = document.getElementById("step2-title");
  const step2Sub = document.getElementById("step2-sub");
  const step3Dot = document.getElementById("step3-dot");
  const step3Sub = document.getElementById("step3-sub");

  let isSubmitted = false;
  let selectedDosenName = "Dr. Budi Santoso";

  function formatFileMeta(file) {
    const ext = (file.name.split(".").pop() || "FILE").toUpperCase();
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB >= 0.1) {
      return `${ext} · ${sizeInMB.toFixed(1).replace(".", ",")} MB`;
    }
    const sizeInKB = Math.max(1, Math.round(file.size / 1024));
    return `${ext} · ${sizeInKB} KB`;
  }

  function selectDosenCard(card) {
    if (isSubmitted || !card) return;
    const name = card.dataset.dosenName || "";
    const dept = card.dataset.dosenDept || "";
    selectedDosenName = name;

    dosenCards.forEach((item) => {
      const isMatch = item === card;
      item.classList.toggle("is-selected", isMatch);
      item.setAttribute("aria-pressed", String(isMatch));
    });

    if (dosenTujuanInput) {
      dosenTujuanInput.value = `${name} · ${dept}`;
    }
  }

  // Pilih kartu dosen (klik atau Enter/Space untuk keyboard accessibility)
  dosenCards.forEach((card) => {
    card.addEventListener("click", () => selectDosenCard(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectDosenCard(card);
      }
    });
  });

  // Tombol "Lihat profil" di dalam kartu dosen
  document.querySelectorAll("[data-dosen-profile]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const card = btn.closest(".dosen-card");
      selectDosenCard(card);

      if (typeof window.showStatusToast === "function") {
        window.showStatusToast("Profil Dosen", btn.dataset.dosenProfile || "Dosen Pembimbing");
      }
    });
  });

  // Pencarian real-time dosen
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;

      dosenCards.forEach((card) => {
        const keywords = (card.dataset.keywords || "").toLowerCase();
        const isMatch = !keyword || keywords.includes(keyword);
        card.classList.toggle("is-hidden", !isMatch);
        if (isMatch) visibleCount += 1;
      });

      if (emptyEl) emptyEl.classList.toggle("is-hidden", visibleCount > 0);
      if (searchStatus) searchStatus.textContent = `Menampilkan ${visibleCount} dosen pembimbing.`;
    });
  }

  // Hitung karakter textarea secara langsung
  function updateCharCount() {
    if (!pesanInput || !charCountEl) return;
    charCountEl.textContent = `${pesanInput.value.length}/500 karakter`;
  }

  if (pesanInput) {
    updateCharCount();
    pesanInput.addEventListener("input", updateCharCount);
  }

  // Ganti file proposal
  if (changeFileBtn && fileInput) {
    changeFileBtn.addEventListener("click", () => {
      if (!isSubmitted) fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (fileNameEl) fileNameEl.textContent = file.name;
      if (fileMetaEl) fileMetaEl.textContent = formatFileMeta(file);
    });
  }

  // Submit form pengajuan pembimbing -> kunci form & update timeline
  if (formEl) {
    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      if (isSubmitted) return;

      isSubmitted = true;

      const now = new Date();
      const tanggal = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      const jam = String(now.getHours()).padStart(2, "0");
      const menit = String(now.getMinutes()).padStart(2, "0");
      const timestamp = `${tanggal} · ${jam}.${menit}`;

      // Nonaktifkan input & ubah tampilan tombol submit
      if (dosenTujuanInput) dosenTujuanInput.disabled = true;
      if (topikInput) topikInput.disabled = true;
      if (pesanInput) pesanInput.disabled = true;
      if (changeFileBtn) changeFileBtn.disabled = true;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("btn-submitted-success");
        submitBtn.textContent = "✓ Pengajuan terkirim";
      }

      // Update timeline StatusPengajuan
      if (step2Dot) {
        step2Dot.className = "timeline-dot is-completed";
        step2Dot.textContent = "✓";
      }
      if (step2Title) step2Title.textContent = "Pengajuan terkirim";
      if (step2Sub) step2Sub.textContent = timestamp;

      if (step3Dot) {
        step3Dot.className = "timeline-dot is-active";
        step3Dot.textContent = "🕒";
      }
      if (step3Sub) step3Sub.textContent = "Menunggu respons dosen";

      if (typeof window.showStatusToast === "function") {
        window.showStatusToast(
          "Pengajuan terkirim",
          `Permohonan pembimbing berhasil dikirim ke ${selectedDosenName}.`
        );
      }
    });
  }
});