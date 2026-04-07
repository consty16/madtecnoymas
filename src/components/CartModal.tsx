import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, ExternalLink, Search } from 'lucide-react';
import { PRODUCTS } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'audio', label: 'Audio' },
  { id: 'electricidad', label: 'Electricidad' },
  { id: 'informatica', label: 'Informática' },
  { id: 'smartwatch', label: 'Smartwatch' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'accesorios', label: 'Accesorios' },
];

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleBuy = (productName: string) => {
    const message = `Hola MAD TECNO Y MAS quiero comprar el siguiente articulo: ${productName}`;
    const url = `https://wa.me/543815341233?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full h-[85vh] bg-surface-container rounded-2xl border border-primary/20 shadow-[0_0_50px_rgba(86,241,224,0.15)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-primary/10 bg-surface-container-low">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-primary" size={24} />
                  <h2 className="text-xl font-bold uppercase tracking-widest text-primary">
                    Catálogo de Productos
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary/20 rounded-full transition-colors text-primary"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background/50 border border-primary/20 rounded-xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        selectedCategory === cat.id
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-primary/5 text-primary border-primary/20 hover:border-primary/50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="flex-grow overflow-y-auto p-6">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-surface-container-low rounded-xl border border-primary/5 p-4 flex flex-col gap-4 hover:border-primary/30 transition-all group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-black/20 relative flex items-center justify-center p-2">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                          {product.isOffer && (
                            <div className="px-2 py-1 bg-tertiary text-white rounded text-[10px] font-bold uppercase border border-tertiary/20 shadow-[0_0_10px_rgba(255,81,250,0.3)]">
                              Oferta
                            </div>
                          )}
                          <div className="px-2 py-1 bg-primary/20 backdrop-blur-md rounded text-[10px] font-bold text-primary uppercase border border-primary/20">
                            {product.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-sm h-10 line-clamp-2">{product.title}</h3>
                      </div>
                      <button
                        onClick={() => handleBuy(product.title)}
                        className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                      >
                        <ExternalLink size={14} />
                        COMPRAR
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant gap-4">
                  <Search size={48} className="opacity-20" />
                  <p className="text-sm font-medium">No se encontraron productos que coincidan con tu búsqueda.</p>
                  <button 
                    onClick={() => { setSearch(''); setSelectedCategory('all'); }}
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-primary/5 border-t border-primary/10 text-center">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                Haz clic en comprar para coordinar el pago y envío por WhatsApp
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
