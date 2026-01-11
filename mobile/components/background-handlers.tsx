import { useNotifications } from "@/hooks/use-notifications";
import {
  useRegisterWidgetBackgroundTask,
  useWidgetUpdater,
} from "@/hooks/use-widget";

export function BackgroundHandlers() {
  useNotifications();
  useWidgetUpdater();
  useRegisterWidgetBackgroundTask();
  return <></>;
}
