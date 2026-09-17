function CategoryNav({ categories, selectedCategory, onSelect }) {
    return (
        <div className="category-nav">
            <button
                className={!selectedCategory ? "active" : ""}
                onClick={() => onSelect("")}
            >
                All
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    className={selectedCategory === category.id ? "active" : ""}
                    onClick={() => onSelect(category.id)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}

export default CategoryNav;