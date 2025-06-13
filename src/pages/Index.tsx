import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useUserRole } from "@/hooks/useUserRole";
import { mockRepairRequests, mockComponents } from "@/lib/mockData";
import Layout from "@/components/Layout";

const Index = () => {
  const { role } = useUserRole();

  const stats = {
    totalRequests: mockRepairRequests.length,
    pendingRequests: mockRepairRequests.filter((r) => r.status === "pending")
      .length,
    inProgressRequests: mockRepairRequests.filter(
      (r) => r.status === "in-progress",
    ).length,
    completedRequests: mockRepairRequests.filter(
      (r) => r.status === "completed",
    ).length,
    totalComponents: mockComponents.length,
    lowStockComponents: mockComponents.filter((c) => c.stock <= c.minStock)
      .length,
    totalValue: mockComponents.reduce((sum, c) => sum + c.price * c.stock, 0),
  };

  const clientStats = [
    {
      title: "Мои заявки",
      value: mockRepairRequests.filter((r) => r.clientName === "Иван Петров")
        .length,
      icon: "FileText",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "В ожидании",
      value: stats.pendingRequests,
      icon: "Clock",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "В работе",
      value: stats.inProgressRequests,
      icon: "Settings",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Завершено",
      value: stats.completedRequests,
      icon: "CheckCircle",
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  const technicianStats = [
    {
      title: "Всего заявок",
      value: stats.totalRequests,
      icon: "FileText",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Ожидают принятия",
      value: stats.pendingRequests,
      icon: "AlertCircle",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Комплектующих",
      value: stats.totalComponents,
      icon: "Package",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Мало на складе",
      value: stats.lowStockComponents,
      icon: "AlertTriangle",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const currentStats = role === "client" ? clientStats : technicianStats;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Дашборд</h1>
            <p className="text-muted-foreground">
              {role === "client"
                ? "Управляйте своими заявками на ремонт"
                : "Обзор всех заявок и склада комплектующих"}
            </p>
          </div>
          <Badge
            variant={role === "technician" ? "default" : "secondary"}
            className="text-sm"
          >
            <Icon name="User" size={16} className="mr-2" />
            {role === "technician" ? "Техник" : "Клиент"}
          </Badge>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon name={stat.icon} size={24} className={stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Activity" size={20} />
                Последние заявки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRepairRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          request.status === "pending"
                            ? "bg-yellow-50"
                            : request.status === "in-progress"
                              ? "bg-blue-50"
                              : request.status === "completed"
                                ? "bg-green-50"
                                : "bg-gray-50"
                        }`}
                      >
                        <Icon
                          name="Wrench"
                          size={16}
                          className={
                            request.status === "pending"
                              ? "text-yellow-600"
                              : request.status === "in-progress"
                                ? "text-blue-600"
                                : request.status === "completed"
                                  ? "text-green-600"
                                  : "text-gray-600"
                          }
                        />
                      </div>
                      <div>
                        <p className="font-medium">#{request.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.deviceType}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        request.status === "pending"
                          ? "secondary"
                          : request.status === "in-progress"
                            ? "default"
                            : request.status === "completed"
                              ? "default"
                              : "secondary"
                      }
                    >
                      {request.status === "pending" && "Ожидает"}
                      {request.status === "in-progress" && "В работе"}
                      {request.status === "completed" && "Завершено"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {role === "technician" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Package" size={20} />
                  Склад комплектующих
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockComponents.slice(0, 3).map((component) => {
                    const isLowStock = component.stock <= component.minStock;
                    return (
                      <div
                        key={component.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${isLowStock ? "bg-red-50" : "bg-green-50"}`}
                          >
                            <Icon
                              name="Package"
                              size={16}
                              className={
                                isLowStock ? "text-red-600" : "text-green-600"
                              }
                            />
                          </div>
                          <div>
                            <p className="font-medium">{component.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {component.brand}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${isLowStock ? "text-red-600" : "text-green-600"}`}
                          >
                            {component.stock} шт.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {component.price.toLocaleString()} ₽
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {role === "client" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Статистика ремонтов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Средняя стоимость
                    </span>
                    <span className="font-semibold">
                      {Math.round(
                        mockRepairRequests.reduce(
                          (sum, r) => sum + (r.estimatedCost || 0),
                          0,
                        ) / mockRepairRequests.length,
                      ).toLocaleString()}{" "}
                      ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Время выполнения
                    </span>
                    <span className="font-semibold">2-3 дня</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Успешность
                    </span>
                    <span className="font-semibold text-green-600">98%</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">
                      Популярные устройства
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Ноутбуки</span>
                        <span>45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ПК</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Моноблоки</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
