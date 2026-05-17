import FoodItem from './FoodItem';

function FoodList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-neutral-600">No food items available</h3>
        <p className="mt-2 text-neutral-500">Please check back later for menu updates.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <FoodItem key={item.id} item={item} />
      ))}
    </div>
  );
}

export default FoodList;