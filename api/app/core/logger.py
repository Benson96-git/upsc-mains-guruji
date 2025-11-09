import logging
import sys

# Create logger
logger = logging.getLogger("app_logger")
logger.setLevel(logging.INFO)

# Log format
formatter = logging.Formatter(
    "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

# Console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)

logger.addHandler(console_handler)