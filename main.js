const list = ko.observableArray([
  {
    key: 'cat1',
    label: 'Обязательные для всех',
    expand: ko.observable(true),
    draggable: ko.observable(false),
    items: [
      { key: 'item1', label: 'Паспорт', draggable: ko.observable(false) },
      { key: 'item2', label: 'ИНН', draggable: ko.observable(false) },
    ],
  },
  {
    key: 'cat2',
    label: 'Обязательные для трудоустройства',
    expand: ko.observable(false),
    draggable: ko.observable(false),
    items: [
      { key: 'item3', label: 'Трудовой договор', draggable: ko.observable(false) },
    ],
  },
  {
    key: 'cat3',
    label: 'Специальные',
    expand: ko.observable(false),
    draggable: ko.observable(false),
    items: [
      { key: 'item4', label: 'Что-то ещё', draggable: ko.observable(false) },
    ],
  },
]);
ko.applyBindings({
  list,
  expandToggle(category) {
    category.expand(!category.expand());
  },
  setDraggable(item, event) {
    event.stopPropagation();
    if (item.draggable()) {
      item.draggable(false);
      return;
    }
    list().forEach((category) => {
      category.draggable(false);
      category.items.forEach((categoryItem) => categoryItem.draggable(false));
    })
    item.draggable(true);
  },
});

const container = '.category-list';

const sortableCategories = new Draggable.Sortable(document.querySelector(container), {
  draggable: '.category',
  handle: '.category--draggable',
  distance: 5,
  mirror: {
    appendTo: container,
    constrainDimensions: true,
  },
});
sortableCategories.on('drag:start', ({ source }) => {
  list().forEach(({ expand }) => expand(false));
  source.classList.remove('expanded');
});
sortableCategories.on('drag:stopped', () => {
  const newSorting = [...document.querySelector(container).querySelectorAll('.category')]
    .map((node) => node.getAttribute('data-category-key'));
  list(newSorting.map((key) => list().find((category) => key === category.key)));
});

const sortableCategoryItems = new Draggable.Sortable(document.querySelectorAll(`${container} .category ul`), {
  draggable: '.category-item',
  handle: '.category-item--draggable',
  distance: 5,
  mirror: {
    appendTo: container,
    constrainDimensions: true,
  },
});
const throttle = (callee, timeout) => {
  let timer = null
  return function perform(...args) {
    if (timer) return
    timer = setTimeout(() => {
      callee(...args)
      clearTimeout(timer)
      timer = null
    }, timeout);
  }
}
sortableCategoryItems.on('drag:move', throttle((event) => {
  const categoryEl = event.originalEvent.target.closest('.category');
  if (categoryEl) {
    document.querySelector(`${container} .category.expanded`).classList.remove('expanded');
    categoryEl.classList.add('expanded');
  }
}, 50));
