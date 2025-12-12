
import os

path = r"c:\Users\user\.gemini\antigravity\scratch\terapie-md\src\components\features\dashboard\AdminDashboard.tsx"

try:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # The content was wrongly interpreted as CP1251 and saved as UTF-8.
    # To reverse: Encode to CP1251 to retrieve original bytes, then decode as UTF-8.
    original_bytes = content.encode("cp1251")
    fixed_content = original_bytes.decode("utf-8")

    with open(path, "w", encoding="utf-8") as f:
        f.write(fixed_content)
    
    print("Successfully fixed encoding.")

except UnicodeEncodeError as e:
    print(f"UnicodeEncodeError: {e}")
    # Fallback/Debug: Show first few chars that failed
    print("Failed to encode back to cp1251. Content might have mixed encoding or different source.")
except UnicodeDecodeError as e:
    print(f"UnicodeDecodeError: {e}")
except Exception as e:
    print(f"Error: {e}")
