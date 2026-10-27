/* ==========================================================================
   PunanovStore — js/main.js
   Небольшие сценарии поверх Bootstrap JS:
   1. Данные о товарах
   2. Модальное окно: подстановка выбранного товара
   3. Валидация форм (Bootstrap validation) + toast об отправке
   4. Каталог: фильтры, поиск, сортировка, ?category=
   5. Страница товара: ?id=, количество
   6. Страница заявки: ?product=, способ доставки, счётчик символов
   ========================================================================== */
(() => {
  "use strict";

  /* 1. Данные о товарах ---------------------------------------------------- */
  const PRODUCTS = {
    sandwich: {
      name: "Бутерброд «Классика»", category: "food", categoryName: "Еда",
      price: 121, oldPrice: null, badge: ["Хит", "text-bg-warning"],
      img: "images/sandwich.webp", w: 640, h: 600,
      alt: "Бутерброд с ветчиной и сыром на белом хлебе",
      short: "Сэндвич с ветчиной и сыром на мягком белом хлебе. Быстрый перекус на каждый день.",
      description: [
        "Классический бутерброд из пшеничного тостового хлеба, двух ломтиков ветчины и двух ломтиков сыра «Российский».",
        "Собирается в день заказа, хранится до 24 часов в холодильнике. Хорошо подходит для перекуса в дороге или на учёбе."
      ],
      specs: [["Состав", "Хлеб, ветчина, сыр"], ["Вес", "180 г"], ["Калорийность", "310 ккал / 100 г"], ["Срок хранения", "24 часа"]]
    },
    bull: {
      name: "Бычок-осеменитель", category: "farm", categoryName: "Ферма",
      price: 150000, oldPrice: null, badge: ["Новинка", "text-bg-success"],
      img: "images/bull.webp", w: 632, h: 640,
      alt: "Чёрный племенной бык в полный рост",
      short: "Племенной чёрный бык крепкого телосложения. Спокойный нрав, подходит для фермерского хозяйства.",
      description: [
        "Племенной бык абердин-ангусской породы, возраст 2 года. Крепкое телосложение, хорошая наследственность, спокойный характер — подходит даже для небольшого фермерского хозяйства.",
        "Животное привито, имеет ветеринарный паспорт и документы о происхождении. Доставка осуществляется специализированным транспортом."
      ],
      specs: [["Порода", "Абердин-ангусская"], ["Возраст", "2 года"], ["Вес", "около 750 кг"], ["Документы", "Ветпаспорт, родословная"]]
    },
    vodka: {
      name: "Водка «Пять Озёр» 0,5 л", category: "drinks", categoryName: "Напитки",
      price: 548, oldPrice: 610, badge: ["Скидка", "text-bg-danger"], adult: true,
      img: "images/vodka.webp", w: 500, h: 640,
      alt: "Бутылка водки «Пять Озёр» с синей этикеткой",
      short: "Водка в классической стеклянной бутылке. Мягкий вкус, подходит для праздничного стола.",
      description: [
        "Классическая водка на спирте «Люкс» и артезианской воде. Мягкий вкус без резкого послевкусия.",
        "Только для лиц старше 18 лет. Товар можно забронировать по заявке и выкупить в пункте самовывоза при предъявлении паспорта."
      ],
      specs: [["Объём", "0,5 л"], ["Крепость", "40%"], ["Производитель", "Россия"], ["Ограничение", "18+"]]
    },
    pelmeni: {
      name: "Пельмени «Домашние» 1 кг", category: "food", categoryName: "Еда",
      price: 389, oldPrice: 450, badge: ["Скидка", "text-bg-danger"],
      img: "images/pelmeni.svg", w: 640, h: 640,
      alt: "Тарелка пельменей со сметаной и укропом",
      short: "Пельмени ручной лепки из говядины и свинины. Варятся 7 минут, лучше всего со сметаной.",
      description: [
        "Пельмени ручной лепки: тонкое тесто и сочная начинка из говядины и свинины с луком и специями.",
        "Варить 7 минут после всплытия. Хранить в морозильной камере при −18 °C."
      ],
      specs: [["Вес", "1 кг"], ["Начинка", "Говядина, свинина"], ["Время варки", "7 минут"], ["Срок хранения", "90 суток"]]
    },
    hen: {
      name: "Курица-несушка", category: "farm", categoryName: "Ферма",
      price: 1200, oldPrice: null, badge: ["Новинка", "text-bg-success"],
      img: "images/hen.svg", w: 640, h: 640,
      alt: "Рыжая курица-несушка рядом с яйцом",
      short: "Молодая рыжая несушка породы ломан браун. До 300 яиц в год, неприхотлива в содержании.",
      description: [
        "Курица породы ломан браун в возрасте 5 месяцев, уже начала нестись. Спокойная, быстро привыкает к новому месту.",
        "Привита от основных заболеваний. Рекомендуем покупать от 3 птиц, чтобы курицам было не скучно."
      ],
      specs: [["Порода", "Ломан браун"], ["Возраст", "5 месяцев"], ["Яйценоскость", "до 300 яиц в год"], ["Прививки", "Есть"]]
    },
    samovar: {
      name: "Самовар электрический 3 л", category: "home", categoryName: "Для дома",
      price: 4990, oldPrice: null, badge: ["Хит", "text-bg-warning"],
      img: "images/samovar.svg", w: 640, h: 640,
      alt: "Латунный электрический самовар с синим заварочным чайником",
      short: "Латунный самовар с заварочным чайником в комплекте. Закипает за 12 минут, есть автоотключение.",
      description: [
        "Электрический самовар из латуни объёмом 3 литра с фарфоровым заварочным чайником в комплекте.",
        "Мощность 1500 Вт, закипает за 12 минут. Есть защита от включения без воды и автоотключение."
      ],
      specs: [["Объём", "3 л"], ["Материал", "Латунь"], ["Мощность", "1500 Вт"], ["Комплект", "Заварочный чайник"]]
    }
  };

  const formatRub = (value) => value.toLocaleString("ru-RU") + " ₽";
  const params = new URLSearchParams(window.location.search);

  /* 2. Модальное окно: выбранный товар ------------------------------------ */
  const orderModal = document.getElementById("orderModal");
  if (orderModal) {
    orderModal.addEventListener("show.bs.modal", (event) => {
      // relatedTarget — кнопка, которая открыла окно (у неё есть data-product)
      const productId = event.relatedTarget?.dataset.product;
      const select = orderModal.querySelector("#modal-product");
      if (productId && select) {
        select.value = productId;
      }
    });
    orderModal.addEventListener("shown.bs.modal", () => {
      orderModal.querySelector("#modal-name")?.focus();
    });
  }

  /* 3. Валидация форм и toast ---------------------------------------------- */
  const toastEl = document.getElementById("appToast");
  const showToast = (text) => {
    if (!toastEl) return;
    document.getElementById("appToastBody").textContent = text;
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 }).show();
  };

  document.querySelectorAll("form.needs-validation").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        form.querySelector(":invalid")?.focus();
        return;
      }

      const data = new FormData(form);
      const product = PRODUCTS[data.get("product")];
      const name = data.get("name").trim();
      const what = product ? `«${product.name}»` : "консультацию";

      form.reset();
      form.classList.remove("was-validated");

      if (form.id === "quickOrderForm") {
        bootstrap.Modal.getInstance(orderModal)?.hide();
      }

      if (form.id === "orderForm") {
        toggleAddress();
        updateCounter();
        const success = document.getElementById("orderSuccess");
        document.getElementById("orderSuccessText").textContent =
          `${name}, заявка на ${what} принята. Менеджер свяжется с вами в течение 15 минут.`;
        success.classList.remove("d-none");
        success.focus();
      }

      showToast(`Спасибо, ${name}! Заявка на ${what} отправлена.`);
    });

    form.addEventListener("reset", () => form.classList.remove("was-validated"));
  });

  /* 4. Каталог ------------------------------------------------------------- */
  const grid = document.getElementById("catalogGrid");
  const filtersForm = document.getElementById("filtersForm");

  if (grid && filtersForm) {
    const items = Array.from(grid.querySelectorAll(".catalog-item"));
    const sortSelect = document.getElementById("sort-select");
    const counter = document.getElementById("resultsCount");
    const emptyState = document.getElementById("emptyState");

    const applyFilters = () => {
      const data = new FormData(filtersForm);
      const query = (data.get("q") || "").trim().toLowerCase();
      const categories = data.getAll("category");
      const priceFrom = Number(data.get("price-from")) || 0;
      const priceTo = Number(data.get("price-to")) || Infinity;
      const onlySale = data.has("sale");

      let visible = 0;
      items.forEach((item) => {
        const price = Number(item.dataset.price);
        const show =
          (!query || item.dataset.name.toLowerCase().includes(query)) &&
          (categories.length === 0 || categories.includes(item.dataset.category)) &&
          price >= priceFrom && price <= priceTo &&
          (!onlySale || item.dataset.sale === "1");
        item.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });

      counter.textContent = visible;
      emptyState.classList.toggle("d-none", visible > 0);
    };

    const applySort = () => {
      const compare = {
        popular: (a, b) => a.dataset.popular - b.dataset.popular,
        "price-asc": (a, b) => a.dataset.price - b.dataset.price,
        "price-desc": (a, b) => b.dataset.price - a.dataset.price,
        name: (a, b) => a.dataset.name.localeCompare(b.dataset.name, "ru")
      }[sortSelect.value];
      items.sort(compare).forEach((item) => grid.appendChild(item));
    };

    // ссылка из меню «Категории»: catalog.html?category=farm
    const startCategory = params.get("category");
    if (startCategory) {
      const box = filtersForm.querySelector(`input[name="category"][value="${CSS.escape(startCategory)}"]`);
      if (box) box.checked = true;
    }

    filtersForm.addEventListener("input", applyFilters);
    filtersForm.addEventListener("submit", (e) => e.preventDefault());
    filtersForm.addEventListener("reset", () => setTimeout(applyFilters));
    sortSelect.addEventListener("change", applySort);
    document.getElementById("resetFiltersBtn").addEventListener("click", () => filtersForm.reset());

    applyFilters();
  }

  /* 5. Страница товара ----------------------------------------------------- */
  const productPage = document.getElementById("productPage");
  if (productPage) {
    const id = PRODUCTS[params.get("id")] ? params.get("id") : productPage.dataset.product;
    const p = PRODUCTS[id];
    const field = (name) => productPage.querySelector(`[data-field="${name}"]`);

    if (id !== productPage.dataset.product) {
      document.title = `${p.name} — PunanovStore`;
      field("crumb").textContent = p.name;
      field("name").textContent = p.name;
      field("short").textContent = p.short;
      field("price").textContent = formatRub(p.price);
      field("category").textContent = p.categoryName;
      field("badge").textContent = p.badge[0];
      field("badge").className = `badge ${p.badge[1]}`;
      Object.assign(field("img"), { src: p.img, alt: p.alt, width: p.w, height: p.h });
      field("description").innerHTML = p.description.map((t) => `<p>${t}</p>`).join("");
      field("specs").innerHTML =
        [["Категория", p.categoryName], ...p.specs, ["Наличие", "В наличии"]]
          .map(([k, v]) => `<tr><th scope="row" class="w-50">${k}</th><td>${v}</td></tr>`).join("");
      productPage.dataset.product = id;
    }

    field("catLink").href = `catalog.html?category=${p.category}`;
    field("adult").classList.toggle("d-none", !p.adult);
    const old = field("old");
    old.textContent = p.oldPrice ? formatRub(p.oldPrice) : "";
    old.classList.toggle("d-none", !p.oldPrice);
    document.getElementById("quickOrderBtn").dataset.product = id;

    // «Смотрите также»: три других товара, кроме текущего
    const related = Array.from(document.querySelectorAll("[data-related]"));
    let shown = 0;
    related.forEach((col) => {
      const show = col.dataset.related !== id && shown < 3;
      col.classList.toggle("d-none", !show);
      if (show) shown += 1;
    });

    // количество и ссылка на подробную заявку
    const qty = document.getElementById("qty");
    const orderLink = document.getElementById("orderLink");
    const syncQty = () => {
      const value = Math.min(99, Math.max(1, Number(qty.value) || 1));
      qty.value = value;
      orderLink.href = `order.html?product=${id}&qty=${value}`;
    };
    productPage.querySelectorAll("[data-qty]").forEach((btn) =>
      btn.addEventListener("click", () => {
        qty.value = Number(qty.value) + Number(btn.dataset.qty);
        syncQty();
      })
    );
    qty.addEventListener("change", syncQty);
    syncQty();
  }

  /* 6. Страница заявки ----------------------------------------------------- */
  const orderForm = document.getElementById("orderForm");
  const addressField = document.getElementById("addressField");
  const addressInput = document.getElementById("order-address");
  const comment = document.getElementById("order-comment");
  const commentCounter = document.getElementById("commentCounter");

  function toggleAddress() {
    if (!orderForm) return;
    const courier = orderForm.querySelector("#delivery-courier").checked;
    addressField.classList.toggle("d-none", !courier);
    addressInput.disabled = !courier;
    addressInput.required = courier;
  }

  function updateCounter() {
    if (comment) commentCounter.textContent = `${comment.value.length} / ${comment.maxLength}`;
  }

  if (orderForm) {
    const product = params.get("product");
    const select = document.getElementById("order-product");
    if (product && select.querySelector(`option[value="${CSS.escape(product)}"]`)) {
      select.value = product;
    }
    const qtyParam = Number(params.get("qty"));
    if (qtyParam >= 1 && qtyParam <= 99) {
      document.getElementById("order-qty").value = qtyParam;
    }

    orderForm.querySelectorAll('input[name="delivery"]').forEach((r) => r.addEventListener("change", toggleAddress));
    orderForm.addEventListener("reset", () => setTimeout(() => { toggleAddress(); updateCounter(); }));
    comment.addEventListener("input", updateCounter);
    toggleAddress();
    updateCounter();
  }
})();
