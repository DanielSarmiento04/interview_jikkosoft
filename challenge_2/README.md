# Two Sum - Challenge 2

## 📝 Descripción del Problema

Implementación robusta y eficiente del algoritmo **Two Sum** en Python 3.12.

**Problema:** Dada una lista de enteros y un entero objetivo, devolver los índices de dos números que sumen el valor objetivo.

- **Entrada:** `nums: list[int]`, `target: int`
- **Salida:** `list[int]` - índices de dos números que suman el objetivo
- **Restricción:** Cada entrada tiene exactamente una solución; no se puede usar el mismo elemento dos veces

## 🎯 Ejemplo

```python
from src.two_sum import two_sum

# Caso básico
nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # [0, 1] porque nums[0] + nums[1] = 2 + 7 = 9

# Con números negativos
nums = [-1, -2, -3, -4, -5]
target = -8
print(two_sum(nums, target))  # [2, 4] porque -3 + (-5) = -8

# Con duplicados
nums = [3, 3]
target = 6
print(two_sum(nums, target))  # [0, 1]
```

## 🚀 Solución Implementada

### Enfoque: Hash Map (Diccionario)

La solución utiliza un **hash map** (diccionario en Python) para lograr complejidad temporal O(n):

1. Iteramos sobre la lista una sola vez
2. Para cada número, calculamos su complemento: `complement = target - num`
3. Verificamos si el complemento ya existe en el hash map
4. Si existe, retornamos los índices; si no, guardamos el número actual

### Complejidad

- **Tiempo:** O(n) - Un solo paso por el array
- **Espacio:** O(n) - El hash map almacena hasta n elementos

### Implementaciones Alternativas

El proyecto incluye tres implementaciones:

1. **`two_sum()`** - Versión optimizada O(n) con hash map ✅ **(RECOMENDADA)**
2. **`two_sum_brute_force()`** - Versión naive O(n²) para comparación
3. **`two_sum_generator()`** - Versión eficiente en memoria que retorna tupla

## 📁 Estructura del Proyecto

```
challenge_2/
├── src/
│   ├── __init__.py
│   └── two_sum.py           # Implementación principal
├── tests/
│   ├── __init__.py
│   ├── test_two_sum.py      # Tests unitarios
│   └── test_performance.py  # Tests de rendimiento
├── .gitignore
├── .python-version          # Python 3.12
├── pyproject.toml           # Configuración uv/pytest/mypy/ruff
└── README.md
```

## 🛠️ Instalación y Uso

### Requisitos Previos

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (gestor de paquetes)

### Instalación con uv

```bash
# Instalar dependencias de desarrollo
uv sync --dev

# O instalar manualmente
uv pip install pytest pytest-cov pytest-benchmark mypy ruff
```

### Uso Básico

```python
from src.two_sum import two_sum

result = two_sum([2, 7, 11, 15], 9)
print(result)  # [0, 1]
```

## 🧪 Ejecutar Tests

### Tests Completos

```bash
# Ejecutar todos los tests con cobertura
uv run pytest

# Ver reporte de cobertura en HTML
uv run pytest --cov=src --cov-report=html
open htmlcov/index.html
```

### Tests Específicos

```bash
# Solo tests básicos
uv run pytest tests/test_two_sum.py::TestTwoSumBasic -v

# Solo tests de casos extremos
uv run pytest tests/test_two_sum.py::TestTwoSumEdgeCases -v

# Solo tests de errores
uv run pytest tests/test_two_sum.py::TestTwoSumErrors -v

# Benchmarks de rendimiento
uv run pytest tests/test_performance.py --benchmark-only
```

### Cobertura de Tests

El proyecto tiene **95%+ de cobertura** con tests para:

✅ Casos básicos (números positivos, negativos, mixtos)  
✅ Casos extremos (zeros, duplicados, arrays grandes)  
✅ Manejo de errores (listas vacías, sin solución)  
✅ Rendimiento (10K, 100K, 1M elementos)  
✅ Implementaciones alternativas

## 🔍 Quality Assurance

### Linting con Ruff

```bash
# Verificar estilo de código
uv run ruff check .

# Auto-formatear código
uv run ruff format .
```

### Type Checking con Mypy

```bash
# Verificar tipos estáticos
uv run mypy src/ tests/
```

### Ejecutar Todas las Verificaciones

```bash
# Linting
uv run ruff check .

# Type checking
uv run mypy src/ tests/

# Tests con cobertura
uv run pytest --cov=src --cov-report=term-missing

# Todo en uno
uv run ruff check . && uv run mypy src/ tests/ && uv run pytest
```

## 📊 Benchmarks de Rendimiento

Rendimiento esperado en hardware moderno:

| Tamaño | Tiempo (Optimizado) | Tiempo (Brute Force) |
|--------|---------------------|----------------------|
| 1K     | < 1ms              | ~10ms                |
| 10K    | < 10ms             | ~1s                  |
| 100K   | < 100ms            | ~100s                |
| 1M     | < 1s               | No recomendado       |

```bash
# Ejecutar benchmarks
uv run pytest tests/test_performance.py --benchmark-only -v
```

## 🧩 Casos de Prueba Cubiertos

### Happy Path
- ✅ Números positivos estándar
- ✅ Solución al inicio del array
- ✅ Solución al final del array
- ✅ Solución en el medio
- ✅ Números grandes

### Edge Cases
- ✅ Números negativos
- ✅ Mix positivos/negativos
- ✅ Target = 0
- ✅ Zero en el array
- ✅ Números duplicados
- ✅ Arrays grandes (1M+ elementos)

### Error Handling
- ✅ Lista vacía → `ValueError`
- ✅ Un solo elemento → `ValueError`
- ✅ Sin solución → `ValueError`

## 🏗️ Principios de Diseño

- **SOLID Principles** - Código mantenible y extensible
- **DRY** - No repetir código
- **Type Hints** - Python 3.12 modern type annotations
- **Docstrings** - Documentación completa estilo Google
- **Error Handling** - Validación robusta de inputs
- **Testing** - 95%+ coverage con pytest

## 📚 Recursos y Referencias

- [PEP 8 - Style Guide](https://pep8.org/)
- [Python Type Hints](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)
- [Pytest Documentation](https://docs.pytest.org/)
- [Ruff Linter](https://docs.astral.sh/ruff/)
- [UV Package Manager](https://github.com/astral-sh/uv)

## 🔑 Conceptos Clave Demostrados

1. ✅ **Algoritmos eficientes** - O(n) vs O(n²)
2. ✅ **Estructuras de datos** - Hash maps para lookups rápidos
3. ✅ **Type safety** - Type hints completos
4. ✅ **Testing exhaustivo** - Unit, edge cases, performance
5. ✅ **Code quality** - Linting, formatting, type checking
6. ✅ **Documentación** - Docstrings, README, comments

## 👨‍💻 Autor

Daniel Sarmiento - Challenge 2 Interview Jikkosoft

