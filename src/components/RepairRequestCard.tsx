import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { RepairRequest } from "@/lib/types";
import { useUserRole } from "@/hooks/useUserRole";

interface RepairRequestCardProps {
  request: RepairRequest;
  onStatusUpdate?: (id: string, status: RepairRequest["status"]) => void;
  onAssign?: (id: string) => void;
}

const RepairRequestCard = ({
  request,
  onStatusUpdate,
  onAssign,
}: RepairRequestCardProps) => {
  const { role } = useUserRole();

  const getPriorityColor = (priority: RepairRequest["priority"]) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: RepairRequest["status"]) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in-progress":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPriorityIcon = (priority: RepairRequest["priority"]) => {
    switch (priority) {
      case "urgent":
        return "AlertTriangle";
      case "high":
        return "AlertCircle";
      case "medium":
        return "Clock";
      case "low":
        return "Minus";
      default:
        return "Clock";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">#{request.id}</h3>
              <Badge variant={getStatusColor(request.status)}>
                {request.status === "pending" && "Ожидает"}
                {request.status === "in-progress" && "В работе"}
                {request.status === "completed" && "Завершено"}
                {request.status === "cancelled" && "Отменено"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Клиент: {request.clientName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(request.priority)}>
              <Icon
                name={getPriorityIcon(request.priority)}
                size={12}
                className="mr-1"
              />
              {request.priority === "urgent" && "Срочно"}
              {request.priority === "high" && "Высокий"}
              {request.priority === "medium" && "Средний"}
              {request.priority === "low" && "Низкий"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Laptop" size={16} className="text-muted-foreground" />
              <span className="font-medium">{request.deviceType}</span>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              {request.deviceModel}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon
                name="MessageSquare"
                size={16}
                className="text-muted-foreground"
              />
              <span className="font-medium">Проблема</span>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              {request.problem}
            </p>
          </div>

          {request.estimatedCost && (
            <div className="flex items-center gap-2">
              <Icon
                name="DollarSign"
                size={16}
                className="text-muted-foreground"
              />
              <span className="font-medium">Оценочная стоимость:</span>
              <span className="font-semibold text-primary">
                {request.estimatedCost.toLocaleString()} ₽
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>Создано: {formatDate(request.createdAt)}</span>
          </div>

          {request.assignedTo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="User" size={14} />
              <span>Назначено: {request.assignedTo}</span>
            </div>
          )}

          {role === "technician" && (
            <div className="flex gap-2 pt-2">
              {request.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate?.(request.id, "in-progress")}
                  >
                    <Icon name="Play" size={14} className="mr-1" />
                    Принять
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAssign?.(request.id)}
                  >
                    <Icon name="UserPlus" size={14} className="mr-1" />
                    Назначить
                  </Button>
                </>
              )}
              {request.status === "in-progress" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusUpdate?.(request.id, "completed")}
                >
                  <Icon name="Check" size={14} className="mr-1" />
                  Завершить
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RepairRequestCard;
