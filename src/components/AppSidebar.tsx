import { Link2, Search, Package, MapPin, Archive, TestTube, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Extracción', url: '/simulator', icon: Link2 },
  { title: 'Búsqueda', url: '/search', icon: Search },
  { title: 'Órdenes', url: '/orders', icon: Package },
  { title: 'Tracking', url: '/tracking', icon: MapPin },
  { title: 'Casilleros', url: '/lockers', icon: Archive },
  { title: 'Demo Simulación', url: '/demo', icon: TestTube },
  { title: 'Admin', url: '/admin', icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const hasActiveRoute = items.some((i) => isActive(i.url));

  return (
    <Sidebar className={open ? 'w-64' : 'w-14'}>
      <SidebarContent>
        <div className="flex items-center justify-between p-4">
          {open && (
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Sistema API
            </h2>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Paneles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
