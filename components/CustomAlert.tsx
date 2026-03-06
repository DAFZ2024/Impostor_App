import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState,
} from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Animated, {
    ZoomIn,
    ZoomOut
} from "react-native-reanimated";

const { width: W } = Dimensions.get("window");

const BG = "#060712";
const CARD = "#0c0e1e";
const BORDER = "#1a1d2e";
const CYAN = "#00e5ff";
const RED = "#ff4757";
const TEXT = "#e8e6f0";
const TEXT_SEC = "#9d9baf";

// ── Types ──────────────────────────────────────────
interface AlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

export interface CustomAlertRef {
  show: (config: AlertConfig) => void;
}

// ── Imperative global ref ──────────────────────────
let globalRef: CustomAlertRef | null = null;

export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[],
) {
  globalRef?.show({ title, message, buttons });
}

// ── Component ──────────────────────────────────────
export const CustomAlert = forwardRef<CustomAlertRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    title: "",
    message: "",
  });

  const show = useCallback((cfg: AlertConfig) => {
    setConfig(cfg);
    setVisible(true);
  }, []);

  useImperativeHandle(ref, () => ({ show }), [show]);

  // Also set the global ref
  React.useEffect(() => {
    globalRef = { show };
    return () => {
      globalRef = null;
    };
  }, [show]);

  const handlePress = (btn?: AlertButton) => {
    setVisible(false);
    btn?.onPress?.();
  };

  const buttons = config.buttons ?? [{ text: "OK", style: "default" }];
  const hasCancel = buttons.some((b) => b.style === "cancel");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => setVisible(false)}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (hasCancel) setVisible(false);
        }}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              entering={ZoomIn.duration(200).springify().damping(18)}
              exiting={ZoomOut.duration(150)}
              style={styles.card}
            >
              {/* Glow accent */}
              <View style={styles.accentGlow} />

              {/* Title */}
              <Text style={styles.title}>{config.title}</Text>

              {/* Message */}
              {config.message ? (
                <Text style={styles.message}>{config.message}</Text>
              ) : null}

              {/* Buttons */}
              <View
                style={[
                  styles.buttonsRow,
                  buttons.length === 1 && styles.buttonsSingle,
                ]}
              >
                {buttons.map((btn, i) => {
                  const isDestructive = btn.style === "destructive";
                  const isCancel = btn.style === "cancel";

                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.7}
                      onPress={() => handlePress(btn)}
                      style={[
                        styles.button,
                        isCancel && styles.buttonCancel,
                        isDestructive && styles.buttonDestructive,
                        !isCancel && !isDestructive && styles.buttonDefault,
                        buttons.length === 1 && styles.buttonFull,
                      ]}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          isCancel && styles.buttonTextCancel,
                          isDestructive && styles.buttonTextDestructive,
                          !isCancel &&
                            !isDestructive &&
                            styles.buttonTextDefault,
                        ]}
                      >
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

CustomAlert.displayName = "CustomAlert";

// ── Styles ─────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: Math.min(W - 48, 340),
    backgroundColor: CARD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 20,
    overflow: "hidden",
  },
  accentGlow: {
    position: "absolute",
    top: -40,
    left: "50%",
    marginLeft: -60,
    width: 120,
    height: 80,
    borderRadius: 60,
    backgroundColor: CYAN,
    opacity: 0.08,
  },
  title: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  message: {
    color: TEXT_SEC,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  buttonsSingle: {
    justifyContent: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonFull: {
    flex: 0,
    paddingHorizontal: 40,
    alignSelf: "center",
  },
  buttonCancel: {
    backgroundColor: "#1a1d2e",
    borderWidth: 1,
    borderColor: "#2a2d3e",
  },
  buttonDestructive: {
    backgroundColor: RED + "18",
    borderWidth: 1,
    borderColor: RED + "40",
  },
  buttonDefault: {
    backgroundColor: CYAN + "18",
    borderWidth: 1,
    borderColor: CYAN + "40",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonTextCancel: {
    color: TEXT_SEC,
  },
  buttonTextDestructive: {
    color: RED,
  },
  buttonTextDefault: {
    color: CYAN,
  },
});
