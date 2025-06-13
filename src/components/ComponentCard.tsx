import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Component } from "@/lib/types";

interface ComponentCardProps {
  component: Component;
  onEdit?: (component: Component) => void;
  onDelete?: (id: string) => void;
  onStockUpdate?: (id: string, stock: number) => void;
}

const ComponentCard = ({
  component,
  onEdit,
  onDelete,
  onStockUpdate,
}: ComponentCardProps) => {
  const isLowStock = component.stock <= component.minStock;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "память":
        return "MemoryStick";
      case "накопители":
        return "HardDrive";
      case "видеокарты":
        return "Monitor";
      case "процессоры":
        return "Cpu";
      case "материнские платы":
        return "CircuitBoard";
      default:
        return "Package";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Icon
                name={getCategoryIcon(component.category)}
                size={20}
                className="text-primary"
              />
              <h3 className="font-semibold text-lg">{component.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {component.brand} {component.model}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline">{component.category}</Badge>
            {isLowStock && (
              <Badge variant="destructive">
                <Icon name="AlertTriangle" size={12} className="mr-1" />
                Мало товара
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {component.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon
                name="Package"
                size={16}
                className="text-muted-foreground"
              />
              <span className="font-medium">Остаток:</span>
              <span
                className={`font-semibold ${isLowStock ? "text-destructive" : "text-green-600"}`}
              >
                {component.stock} шт.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                name="DollarSign"
                size={16}
                className="text-muted-foreground"
              />
              <span className="font-semibold text-primary">
                {component.price.toLocaleString()} ₽
              </span>
            </div>
          </div>

          {Object.keys(component.specifications).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  name="Settings"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="font-medium">Характеристики</span>
              </div>
              <div className="space-y-1 ml-6">
                {Object.entries(component.specifications).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(component)}
            >
              <Icon name="Edit" size={14} className="mr-1" />
              Изменить
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStockUpdate?.(component.id, component.stock + 1)}
            >
              <Icon name="Plus" size={14} className="mr-1" />
              +1
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onStockUpdate?.(component.id, Math.max(0, component.stock - 1))
              }
              disabled={component.stock === 0}
            >
              <Icon name="Minus" size={14} className="mr-1" />
              -1
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentCard;
