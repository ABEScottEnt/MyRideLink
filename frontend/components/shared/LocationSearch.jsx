import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "@/constants/theme";

export default function LocationSearch({
  fromValue = "",
  toValue = "",
  onChangeFrom = () => {},
  onChangeTo = () => {},
  onClearFrom = () => {},
  onClearTo = () => {},
  onSelectFrom = () => {},
  onSelectTo = () => {},
  onSubmit = () => {},
  submitText = "Search",
  style = {},
  buttons = null,
}) {
  const [activeField, setActiveField] = useState(null); // 'from' | 'to' | null
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);

  const PHOTON_API_URL = "https://photon.komoot.io/api/";

  const buildLabel = (props) => {
    const parts = [];
    if (props.name) parts.push(props.name);
    const streetPart = [props.housenumber, props.street]
      .filter(Boolean)
      .join(" ");
    if (streetPart) parts.push(streetPart);
    const cityPart = [props.postcode, props.city || props.town || props.village]
      .filter(Boolean)
      .join(" ");
    if (cityPart) parts.push(cityPart);
    if (props.state) parts.push(props.state);
    if (props.country) parts.push(props.country);
    return parts.join(", ");
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      setIsLoading(true);
      const url = `${PHOTON_API_URL}?q=${encodeURIComponent(
        query
      )}&limit=5&lang=en`;
      const res = await fetch(url);
      const data = await res.json();
      const mapped = Array.isArray(data.features)
        ? data.features.map((f, idx) => {
            const { coordinates = [] } = f.geometry || {};
            const [lon, lat] = coordinates;
            const props = f.properties || {};
            return {
              id: `${props.osm_id || idx}-${lon}-${lat}`,
              label: buildLabel(props),
              sublabel: [props.osm_value, props.country]
                .filter(Boolean)
                .join(" • "),
              lat,
              lon,
              raw: f,
            };
          })
        : [];
      setSuggestions(mapped.filter((s) => s.label));
    } catch (e) {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce lookups on controlled values based on the active field
    const query =
      activeField === "from" ? fromValue : activeField === "to" ? toValue : "";
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!activeField) return;
    debounceTimer.current = setTimeout(() => fetchSuggestions(query), 250);
    return () => debounceTimer.current && clearTimeout(debounceTimer.current);
  }, [fromValue, toValue, activeField]);

  const handleSelect = (item) => {
    if (activeField === "from") {
      onChangeFrom(item.label);
      onSelectFrom(item);
    } else if (activeField === "to") {
      onChangeTo(item.label);
      onSelectTo(item);
    }
    setSuggestions([]);
    setActiveField(null);
  };

  const handleBlur = () => {
    // Small delay to allow onPress of a suggestion to register
    setTimeout(() => {
      setActiveField(null);
      setSuggestions([]);
    }, 150);
  };

  return (
    <View style={[styles.outerContainer, style]}>
      <View style={styles.inputRow}>
        <MaterialIcons
          name="location-on"
          size={20}
          color={COLORS.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="From"
          placeholderTextColor={COLORS.muted}
          value={fromValue}
          onFocus={() => setActiveField("from")}
          onBlur={handleBlur}
          onChangeText={(txt) => {
            setActiveField("from");
            onChangeFrom(txt);
          }}
        />
        {!!fromValue && (
          <TouchableOpacity onPress={onClearFrom} style={styles.clearBtn}>
            <MaterialIcons name="close" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>
      {activeField === "from" && suggestions.length > 0 && (
        <View style={styles.suggestionList}>
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.suggestionItem}
              onPress={() => handleSelect(s)}
            >
              <Text style={styles.suggestionText} numberOfLines={1}>
                {s.label}
              </Text>
              {!!s.sublabel && (
                <Text style={styles.suggestionSubText} numberOfLines={1}>
                  {s.sublabel}
                </Text>
              )}
            </TouchableOpacity>
          ))}
          {isLoading && (
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionSubText}>Searching…</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.inputRow}>
        <MaterialIcons
          name="location-on"
          size={20}
          color={COLORS.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          placeholderTextColor={COLORS.muted}
          value={toValue}
          onFocus={() => setActiveField("to")}
          onBlur={handleBlur}
          onChangeText={(txt) => {
            setActiveField("to");
            onChangeTo(txt);
          }}
        />
        {!!toValue && (
          <TouchableOpacity onPress={onClearTo} style={styles.clearBtn}>
            <MaterialIcons name="close" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>
      {activeField === "to" && suggestions.length > 0 && (
        <View style={styles.suggestionList}>
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.suggestionItem}
              onPress={() => handleSelect(s)}
            >
              <Text style={styles.suggestionText} numberOfLines={1}>
                {s.label}
              </Text>
              {!!s.sublabel && (
                <Text style={styles.suggestionSubText} numberOfLines={1}>
                  {s.sublabel}
                </Text>
              )}
            </TouchableOpacity>
          ))}
          {isLoading && (
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionSubText}>Searching…</Text>
            </View>
          )}
        </View>
      )}
      {Array.isArray(buttons) && buttons.length > 0 ? (
        <View style={styles.buttonRow}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={btn.label}
              style={[styles.submitBtn, idx > 0 && { marginLeft: 10, flex: 1 }]}
              onPress={btn.onPress}
            >
              <Text style={styles.submitText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitText}>{submitText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderColor: COLORS.muted,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
    marginVertical: 16,
    backgroundColor: COLORS.white,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginLeft: 4,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderRadius: 10,
    marginVertical: 0,
  },
  clearBtn: {
    marginLeft: 8,
    padding: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.gradientEnd,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    flex: 1,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  suggestionList: {
    borderColor: COLORS.muted,
    borderWidth: 0.5,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    marginTop: -6,
    marginBottom: 8,
    overflow: "hidden",
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: COLORS.text,
    fontSize: 14,
  },
  suggestionSubText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
