/* global describe, it */
'use strict';

var assert = _interopRequireWildcard(require("assert"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const copyProperties = require('../../../main/enums/copyProperties');

describe('copyProperties', function () {
  it('Simple', () => {
    assert.deepStrictEqual(copyProperties({
      foo: 1
    }, {
      foo: 2,
      bar: 2
    }), {
      foo: 2,
      bar: 2
    });
  });
  it('Getter', () => {
    const target = {};
    const source = {
      get foo() {
        return 1;
      }

    };
    const getter = Object.getOwnPropertyDescriptor(source, 'foo').get;
    copyProperties(target, source);
    throw new Error();
    assert.deepStrictEqual(Object.getOwnPropertyDescriptor(target, 'foo'), {
      get: getter,
      set: undefined,
      enumerable: true,
      configurable: true
    });
  });
  it('Setter', () => {
    const target = {};
    const source = {
      get foo() {
        return this.value;
      },

      set foo(value) {
        this.value = value;
      }

    };
    const setter = Object.getOwnPropertyDescriptor(source, 'foo').set;
    const getter = Object.getOwnPropertyDescriptor(source, 'foo').get;
    copyProperties(target, source);
    assert.deepStrictEqual(Object.getOwnPropertyDescriptor(target, 'foo'), {
      set: setter,
      get: getter,
      enumerable: true,
      configurable: true
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90ZXN0L3VuaXQvZW51bXMvQ29weVByb3BlcnRpZXMuc3BlYy5qcyJdLCJuYW1lcyI6WyJjb3B5UHJvcGVydGllcyIsInJlcXVpcmUiLCJkZXNjcmliZSIsIml0IiwiYXNzZXJ0IiwiZGVlcFN0cmljdEVxdWFsIiwiZm9vIiwiYmFyIiwidGFyZ2V0Iiwic291cmNlIiwiZ2V0dGVyIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZ2V0IiwiRXJyb3IiLCJzZXQiLCJ1bmRlZmluZWQiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwidmFsdWUiLCJzZXR0ZXIiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7O0FBRUE7Ozs7OztBQUVBLE1BQU1BLGNBQWMsR0FBR0MsT0FBTyxDQUFDLG9DQUFELENBQTlCOztBQUVBQyxRQUFRLENBQUMsZ0JBQUQsRUFBbUIsWUFBWTtBQUNyQ0MsRUFBQUEsRUFBRSxDQUFDLFFBQUQsRUFBVyxNQUFNO0FBQ2pCQyxJQUFBQSxNQUFNLENBQUNDLGVBQVAsQ0FDRUwsY0FBYyxDQUFDO0FBQUVNLE1BQUFBLEdBQUcsRUFBRTtBQUFQLEtBQUQsRUFBYTtBQUFFQSxNQUFBQSxHQUFHLEVBQUUsQ0FBUDtBQUFVQyxNQUFBQSxHQUFHLEVBQUU7QUFBZixLQUFiLENBRGhCLEVBRUU7QUFBRUQsTUFBQUEsR0FBRyxFQUFFLENBQVA7QUFBVUMsTUFBQUEsR0FBRyxFQUFFO0FBQWYsS0FGRjtBQUlELEdBTEMsQ0FBRjtBQU1BSixFQUFBQSxFQUFFLENBQUMsUUFBRCxFQUFXLE1BQU07QUFDakIsVUFBTUssTUFBTSxHQUFHLEVBQWY7QUFDQSxVQUFNQyxNQUFNLEdBQUc7QUFBRSxVQUFJSCxHQUFKLEdBQVc7QUFBRSxlQUFPLENBQVA7QUFBVTs7QUFBekIsS0FBZjtBQUNBLFVBQU1JLE1BQU0sR0FBR0MsTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ0gsTUFBaEMsRUFBd0MsS0FBeEMsRUFBK0NJLEdBQTlEO0FBQ0FiLElBQUFBLGNBQWMsQ0FBQ1EsTUFBRCxFQUFTQyxNQUFULENBQWQ7QUFDQSxVQUFNLElBQUlLLEtBQUosRUFBTjtBQUNBVixJQUFBQSxNQUFNLENBQUNDLGVBQVAsQ0FDRU0sTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ0osTUFBaEMsRUFBd0MsS0FBeEMsQ0FERixFQUVFO0FBQUVLLE1BQUFBLEdBQUcsRUFBRUgsTUFBUDtBQUFlSyxNQUFBQSxHQUFHLEVBQUVDLFNBQXBCO0FBQStCQyxNQUFBQSxVQUFVLEVBQUUsSUFBM0M7QUFBaURDLE1BQUFBLFlBQVksRUFBRTtBQUEvRCxLQUZGO0FBSUQsR0FWQyxDQUFGO0FBV0FmLEVBQUFBLEVBQUUsQ0FBQyxRQUFELEVBQVcsTUFBTTtBQUNqQixVQUFNSyxNQUFNLEdBQUcsRUFBZjtBQUNBLFVBQU1DLE1BQU0sR0FBRztBQUNiLFVBQUlILEdBQUosR0FBVztBQUFFLGVBQU8sS0FBS2EsS0FBWjtBQUFtQixPQURuQjs7QUFFYixVQUFJYixHQUFKLENBQVNhLEtBQVQsRUFBZ0I7QUFBRSxhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFBb0I7O0FBRnpCLEtBQWY7QUFJQSxVQUFNQyxNQUFNLEdBQUdULE1BQU0sQ0FBQ0Msd0JBQVAsQ0FBZ0NILE1BQWhDLEVBQXdDLEtBQXhDLEVBQStDTSxHQUE5RDtBQUNBLFVBQU1MLE1BQU0sR0FBR0MsTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ0gsTUFBaEMsRUFBd0MsS0FBeEMsRUFBK0NJLEdBQTlEO0FBQ0FiLElBQUFBLGNBQWMsQ0FBQ1EsTUFBRCxFQUFTQyxNQUFULENBQWQ7QUFDQUwsSUFBQUEsTUFBTSxDQUFDQyxlQUFQLENBQ0VNLE1BQU0sQ0FBQ0Msd0JBQVAsQ0FBZ0NKLE1BQWhDLEVBQXdDLEtBQXhDLENBREYsRUFFRTtBQUFFTyxNQUFBQSxHQUFHLEVBQUVLLE1BQVA7QUFBZVAsTUFBQUEsR0FBRyxFQUFFSCxNQUFwQjtBQUE0Qk8sTUFBQUEsVUFBVSxFQUFFLElBQXhDO0FBQThDQyxNQUFBQSxZQUFZLEVBQUU7QUFBNUQsS0FGRjtBQUlELEdBYkMsQ0FBRjtBQWNELENBaENPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgZGVzY3JpYmUsIGl0ICovXG4ndXNlIHN0cmljdCdcblxuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2Fzc2VydCdcblxuY29uc3QgY29weVByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi8uLi8uLi9tYWluL2VudW1zL2NvcHlQcm9wZXJ0aWVzJylcblxuZGVzY3JpYmUoJ2NvcHlQcm9wZXJ0aWVzJywgZnVuY3Rpb24gKCkge1xuICBpdCgnU2ltcGxlJywgKCkgPT4ge1xuICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gICAgICBjb3B5UHJvcGVydGllcyh7IGZvbzogMSB9LCB7IGZvbzogMiwgYmFyOiAyIH0pLFxuICAgICAgeyBmb286IDIsIGJhcjogMiB9XG4gICAgKVxuICB9KVxuICBpdCgnR2V0dGVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IHt9XG4gICAgY29uc3Qgc291cmNlID0geyBnZXQgZm9vICgpIHsgcmV0dXJuIDEgfSB9XG4gICAgY29uc3QgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsICdmb28nKS5nZXRcbiAgICBjb3B5UHJvcGVydGllcyh0YXJnZXQsIHNvdXJjZSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoKVxuICAgIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwoXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgJ2ZvbycpLFxuICAgICAgeyBnZXQ6IGdldHRlciwgc2V0OiB1bmRlZmluZWQsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9XG4gICAgKVxuICB9KVxuICBpdCgnU2V0dGVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IHt9XG4gICAgY29uc3Qgc291cmNlID0ge1xuICAgICAgZ2V0IGZvbyAoKSB7IHJldHVybiB0aGlzLnZhbHVlIH0sXG4gICAgICBzZXQgZm9vICh2YWx1ZSkgeyB0aGlzLnZhbHVlID0gdmFsdWUgfVxuICAgIH1cbiAgICBjb25zdCBzZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgJ2ZvbycpLnNldFxuICAgIGNvbnN0IGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCAnZm9vJykuZ2V0XG4gICAgY29weVByb3BlcnRpZXModGFyZ2V0LCBzb3VyY2UpXG4gICAgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbChcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCAnZm9vJyksXG4gICAgICB7IHNldDogc2V0dGVyLCBnZXQ6IGdldHRlciwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH1cbiAgICApXG4gIH0pXG59KVxuIl19