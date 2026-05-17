import MenuItem from './MenuItem';

function MenuItemsList({ items, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 bg-neutral-50 rounded-lg">
        <h3 className="text-lg font-medium text-neutral-700">No menu items yet</h3>
        <p className="text-neutral-500 mt-1">Add your first menu item to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <MenuItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default MenuItemsList;